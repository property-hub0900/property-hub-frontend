/* eslint-disable no-unused-vars */
"use client";

import type React from "react";

import { useState, useRef, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, CheckCircle, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { authService } from "@/services/auth";
import { Loader } from "../loader";

// Define OTP length as a constant for easy modification
const OTP_LENGTH = 6;
const RESEND_COOLDOWN = 30;

interface VerificationFormProps {
  email: string;
  redirectPath: string;
  t: (key: string) => string;
}

export function VerificationForm({
  email,
  redirectPath,
  t,
}: VerificationFormProps) {
  const router = useRouter();

  const [otp, setOtp] = useState<string[]>(new Array(OTP_LENGTH).fill(""));
  const [activeOtpIndex, setActiveOtpIndex] = useState<number>(0);
  const [error, setError] = useState<string>("");
  const [successMessage, setSuccessMessage] = useState<string>("");
  const [resendTimer, setResendTimer] = useState(RESEND_COOLDOWN);
  const [verificationStatus, setVerificationStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const formRef = useRef<HTMLFormElement>(null);

  const isOtpComplete = otp.every((digit) => digit !== "");
  const isFormDisabled =
    verificationStatus === "loading" || verificationStatus === "success";
  const canResend =
    resendTimer === 0 &&
    verificationStatus !== "loading" &&
    verificationStatus !== "success";

  // Mutations
  const verifyOtpMutation = useMutation({
    mutationKey: [`verifyOtp`],
    mutationFn: (data: { email: string; otpCode: string }) =>
      authService.verifyOtp(data.email, data.otpCode),
    onSuccess: (response) => {
      if (response.message) {
        setSuccessMessage(response.message || t("verificationSuccess"));
        setVerificationStatus("success");

        // Redirect to dashboard after a short delay
        setTimeout(() => {
          router.push(redirectPath);
        }, 1500);
      } else {
        throw new Error(t("verificationFailed"));
      }
    },
    onError: (error: any) => {
      setError(error.message || t("verificationFailed"));
      setVerificationStatus("error");

      // Focus first input for retry
      setTimeout(() => {
        inputRefs.current[0]?.focus();
      }, 100);
    },
  });

  const resendOtpMutation = useMutation({
    mutationKey: [`resendOtp`],
    mutationFn: (email: string) => authService.resendOtp(email),
    onSuccess: (response) => {
      if (response.message) {
        // Reset OTP fields
        setOtp(new Array(OTP_LENGTH).fill(""));
        setActiveOtpIndex(0);

        // Reset timer
        setResendTimer(RESEND_COOLDOWN);

        // Focus first input
        setTimeout(() => {
          inputRefs.current[0]?.focus();
        }, 100);

        // Set success message
        setSuccessMessage(t("otpResent"));
        setTimeout(() => {
          setSuccessMessage("");
        }, 3000);

        toast.success(t("otpResent"));
      } else {
        throw new Error(t("resendFailed"));
      }
    },
    onError: (error: any) => {
      setError(error.message || t("resendFailed"));
      toast.error(error.message || t("resendFailed"));
    },
  });

  // Timer for resend cooldown
  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [resendTimer]);

  // Focus first input on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      inputRefs.current[0]?.focus();
    }, 500); // Small delay to ensure component is fully rendered

    return () => clearTimeout(timer);
  }, []);

  const resetForm = useCallback(() => {
    setOtp(new Array(OTP_LENGTH).fill(""));
    setActiveOtpIndex(0);
    setError("");
    setSuccessMessage("");
    setVerificationStatus("idle");
    setTimeout(() => {
      inputRefs.current[0]?.focus();
    }, 100);
  }, []);
  // Reset form when email changes
  useEffect(() => {
    if (email) {
      resetForm();
    }
  }, [email, resetForm]);

  // Reset form function


  // Handle input change
  const handleOnChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
      const value = e.target.value;
      if (isNaN(Number(value))) return; // Only allow numbers

      const newOtp = [...otp];
      // Allow only one input
      newOtp[index] = value.substring(value.length - 1);
      setOtp(newOtp);

      // Clear any previous errors when user starts typing again
      if (error) setError("");
      if (verificationStatus === "error") setVerificationStatus("idle");

      // Move to next input if value is entered
      if (value && index < OTP_LENGTH - 1) {
        setActiveOtpIndex(index + 1);
        inputRefs.current[index + 1]?.focus();
      }

      // Auto-submit if all digits are filled and this is the last digit
      if (
        value &&
        index === OTP_LENGTH - 1 &&
        newOtp.every((digit) => digit !== "")
      ) {
        setTimeout(() => {
          formRef.current?.requestSubmit();
        }, 300); // Small delay for better UX
      }
    },
    [otp, error, verificationStatus]
  );

  // Handle key down events
  const handleOnKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
      if (e.key === "Backspace") {
        e.preventDefault();
        const newOtp = [...otp];

        // If current field is empty and not the first field, move to previous field
        if (otp[index] === "" && index > 0) {
          setActiveOtpIndex(index - 1);
          inputRefs.current[index - 1]?.focus();
          return;
        }

        // Clear current field
        newOtp[index] = "";
        setOtp(newOtp);

        // Move to previous input after clearing current field
        if (index > 0) {
          setActiveOtpIndex(index - 1);
          inputRefs.current[index - 1]?.focus();
        }
      } else if (e.key === "ArrowLeft" && index > 0) {
        setActiveOtpIndex(index - 1);
        inputRefs.current[index - 1]?.focus();
      } else if (e.key === "ArrowRight" && index < OTP_LENGTH - 1) {
        setActiveOtpIndex(index + 1);
        inputRefs.current[index + 1]?.focus();
      }
    },
    [otp]
  );

  // Handle paste functionality
  const handleOnPaste = useCallback(
    (e: React.ClipboardEvent<HTMLInputElement>) => {
      e.preventDefault();
      const pastedData = e.clipboardData.getData("text/plain").trim();
      if (!/^\d+$/.test(pastedData)) return; // Only allow numbers

      const otpArray = pastedData.slice(0, OTP_LENGTH).split("");
      const newOtp = [...otp];

      otpArray.forEach((value, index) => {
        if (index < OTP_LENGTH) {
          newOtp[index] = value;
        }
      });

      setOtp(newOtp);

      // Clear any previous errors when user pastes a new code
      if (error) setError("");
      if (verificationStatus === "error") setVerificationStatus("idle");

      // Focus last filled input or first empty input
      const lastFilledIndex = Math.min(otpArray.length - 1, OTP_LENGTH - 1);
      setActiveOtpIndex(lastFilledIndex);
      inputRefs.current[lastFilledIndex]?.focus();

      // Auto-submit if all digits are filled
      if (newOtp.every((digit) => digit !== "")) {
        setTimeout(() => {
          formRef.current?.requestSubmit();
        }, 300); // Small delay for better UX
      }
    },
    [otp, error, verificationStatus]
  );

  // Form submission handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Reset states
    setError("");
    setSuccessMessage("");
    setVerificationStatus("loading");

    try {
      const otpString = otp.join("");

      // Validation
      if (otpString.length !== OTP_LENGTH) {
        throw new Error(t("invalidOtpLength"));
      }

      if (!email) {
        throw new Error(t("emailRequired"));
      }

      // Call the verify OTP mutation
      await verifyOtpMutation.mutateAsync({ email, otpCode: otpString });
    } catch (error: any) {
      setError(error.message);
      // Error handling is done in the mutation callbacks
    }
  };

  // Resend OTP handler
  const handleResendOtp = async () => {
    if (
      resendTimer > 0 ||
      verificationStatus === "loading" ||
      verificationStatus === "success"
    )
      return;

    setError("");

    try {
      if (!email) {
        throw new Error(t("emailRequired"));
      }

      // Call the resend OTP mutation
      await resendOtpMutation.mutateAsync(email);
    } catch (error: any) {
      setError(error.message);
      // Error handling is done in the mutation callbacks
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="w-full"
    >
      <Loader
        isLoading={resendOtpMutation.isPending || verifyOtpMutation.isPending}
      ></Loader>
      <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
        {email && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center text-sm text-muted-foreground"
          >
            {t("codeSentTo")} <span className="font-medium">{email}</span>
          </motion.p>
        )}

        <div className="flex justify-center space-x-4">
          {otp.map((digit, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
            >
              <input
                ref={(ref) => (inputRefs.current[index] = ref) as any}
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={1}
                value={digit}
                onChange={(e) => handleOnChange(e, index)}
                onKeyDown={(e) => handleOnKeyDown(e, index)}
                onPaste={index === 0 ? handleOnPaste : undefined}
                disabled={isFormDisabled}
                className={cn(
                  "w-12 h-14 text-center text-2xl font-semibold border rounded-lg",
                  "focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent",
                  "transition-all duration-200",
                  activeOtpIndex === index ? "border-primary" : "border-input",
                  isFormDisabled && "opacity-70 cursor-not-allowed",
                  verificationStatus === "success" &&
                  "border-green-500 text-green-600",
                  verificationStatus === "error" &&
                  "border-red-500 text-red-600"
                )}
                aria-label={`Digit ${index + 1} of ${OTP_LENGTH}`}
                aria-invalid={verificationStatus === "error"}
                aria-describedby={error ? "otp-error" : undefined}
                tabIndex={isFormDisabled ? -1 : 0}
              />
            </motion.div>
          ))}
        </div>

        <AnimatePresence>
          {error && (
            <motion.p
              id="otp-error"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="text-destructive text-center text-sm flex items-center justify-center gap-1"
              role="alert"
            >
              <AlertCircle className="h-4 w-4" />
              {error}
            </motion.p>
          )}

          {successMessage && (
            <motion.p
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="text-green-600 text-center text-sm flex items-center justify-center gap-1"
              role="status"
            >
              <CheckCircle className="h-4 w-4" />
              {successMessage}
            </motion.p>
          )}
        </AnimatePresence>

        <Button
          type="submit"
          className={cn(
            "w-full relative",
            verificationStatus === "success" &&
            "bg-green-600 hover:bg-green-700"
          )}
          disabled={
            verifyOtpMutation.isPending ||
            !isOtpComplete ||
            verificationStatus === "success"
          }
          aria-busy={verifyOtpMutation.isPending}
        >
          {verifyOtpMutation.isPending && (
            <Loader2 className="mr-2 h-4 w-4 animate-spin absolute left-4" />
          )}
          {verificationStatus === "success" ? (
            <span className="flex items-center justify-center">
              <CheckCircle className="mr-2 h-4 w-4" />
              {t("verified")}
            </span>
          ) : verifyOtpMutation.isPending ? (
            t("verifying")
          ) : (
            t("verify")
          )}
        </Button>

        <div className="text-center text-sm">
          <span className="text-muted-foreground">{t("didntReceiveCode")}</span>{" "}
          <button
            type="button"
            onClick={handleResendOtp}
            className={cn(
              "text-primary hover:underline focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded px-1",
              !canResend && "cursor-not-allowed opacity-50"
            )}
            disabled={!canResend || resendOtpMutation.isPending}
            aria-busy={resendOtpMutation.isPending}
            aria-disabled={!canResend}
          >
            {resendTimer > 0 ? (
              `${t("resendIn")} ${resendTimer}s`
            ) : resendOtpMutation.isPending ? (
              <span className="flex items-center">
                <Loader2 className="mr-1 h-3 w-3 animate-spin" />
                {t("resending")}
              </span>
            ) : (
              t("resendCode")
            )}
          </button>
        </div>
      </form>

      <div className="text-center text-sm text-muted-foreground mt-6">
        {t("otpDisclaimer")}
      </div>
    </motion.div>
  );
}

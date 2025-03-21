"use client"

import Image from "next/image"
import type React from "react"
import FacebookLogin from "react-facebook-login"

interface CustomFacebookButtonProps {
    appId: string
    callback: (response: any) => void
    className?: string
}

export const CustomFacebookButton: React.FC<CustomFacebookButtonProps> = ({ appId, callback, className = "" }) => {
    return (
        <div className={`relative w-full ${className}`}>
            <FacebookLogin
                appId={appId}
                autoLoad={false}
                fields="name, picture"
                scope="public_profile"
                callback={callback}
                cssClass="facebook-login-button"
                icon={false}
                textButton="Sign in"
            />

            <div className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10">
                <Image src="/facebook-login-icon.svg" alt="Facebook" width={24} height={24} />
            </div>

            <style jsx global>{`
                .facebook-login-button {
                    display: flex !important;
                    align-items: center !important;
                    justify-content: center !important;
                    width: 120% !important;
                    height: 40px !important;
                    border-radius: 20px !important;
                    border: 1px solid #e0e0e0 !important;
                    background-color: white !important;
                    font-size: 14px !important;
                    font-weight: 500 !important;
                    cursor: pointer !important;
                    box-shadow: none !important;
                    position: relative !important;
                    padding-left: 36px !important; /* Add padding to create space for the icon */
                }
                
                /* Add specific styling for the text span */
                .facebook-login-button span {
                    margin-left: 8px !important; /* Add additional margin to create gap between icon and text */
                    display: flex !important;
                    align-items: center !important;
                }
            `}</style>
        </div>
    )
}


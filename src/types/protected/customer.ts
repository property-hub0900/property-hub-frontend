export interface ICustomerGetMeUser {
  userId: number;
  username: string;
  email: string;
  role: string;
  facebookId: string | null;
  googleId: string | null;
  languagePref: string;
  emailVerified: boolean;
  loginWith: string;
  companyId: number | null;
  lastLogin: string;
  status: boolean;
  isExpireToken: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ICustomerGetMe {
  customerId: number;
  phoneNumber: string;
  firstName: string;
  lastName: string;
  profilePhoto?: string | null;
  firebaseToken: string;
  inAppNotification: boolean;
  emailNotification: boolean;
  userId: number;
  createdAt: string;
  user: ICustomerGetMeUser;
}

export interface IUpdateCustomerProfile {
  phoneNumber: string;
  firstName: string;
  lastName: string;
  profilePhoto?: string | null;
  firebaseToken: string;
  inAppNotification: boolean;
  emailNotification: boolean;
}

export interface IChangePassword {
  currentPassword: string;
  password: string;
}

interface INotificationRecipient {
  readStatus: boolean;
}

export interface INotification {
  notificationId: number;
  titleEn: string;
  titleAr: string;
  bodyEn: string;
  bodyAr: string;
  imgUrl: string | null;
  createdAt: string;
  notificationRecipients: INotificationRecipient[];
}

import { User } from "firebase/auth";

/**
 * Generates a unique referral code for a user
 * 
 * @param userId The Firebase user ID
 * @returns A unique referral code
 */
export function generateReferralCode(userId: string): string {
  // Generate a code based on userId and a random element
  const randomChars = Math.random().toString(36).substring(2, 8).toUpperCase();
  // Take first 4 characters of the userId and combine with random chars
  const userIdPart = userId.substring(0, 4).toUpperCase();
  
  return `${userIdPart}${randomChars}`;
}

/**
 * Creates a referral link for sharing
 * 
 * @param referralCode The user's referral code
 * @returns A full referral URL
 */
export function createReferralLink(referralCode: string): string {
  // In production, use the actual domain
  const domain = typeof window !== 'undefined' ? window.location.origin : 'https://studylens.ai';
  return `${domain}/signup?ref=${referralCode}`;
}

/**
 * Tracks a referral in the system
 * Placeholder for a real implementation that would use Firebase or another backend
 * 
 * @param referrerCode The code of the user who referred
 * @param newUserId The ID of the new user who signed up
 */
export async function trackReferral(referrerCode: string, newUserId: string): Promise<boolean> {
  try {
    // In a real implementation, this would call your API or update Firestore directly
    console.log(`Tracked referral: ${referrerCode} referred ${newUserId}`);
    
    // Simulate an API call with a promise
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(true);
      }, 500);
    });
  } catch (error) {
    console.error("Error tracking referral:", error);
    return false;
  }
}

/**
 * Claims a reward for a successful referral
 * Placeholder for a real implementation
 * 
 * @param userId The user ID of the referrer
 * @param referredUserId The user ID of the referred user
 */
export async function claimReferralReward(userId: string, referredUserId: string): Promise<boolean> {
  try {
    // This would be implemented to connect with your payment system or rewards system
    console.log(`User ${userId} claimed reward for referring ${referredUserId}`);
    
    // Simulate an API call with a promise
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(true);
      }, 500);
    });
  } catch (error) {
    console.error("Error claiming referral reward:", error);
    return false;
  }
}

/**
 * Gets the referral statistics for a user
 * Placeholder for a real implementation
 * 
 * @param userId The user ID
 * @returns Object with referral stats
 */
export async function getReferralStats(userId: string): Promise<{
  totalReferrals: number;
  pendingReferrals: number;
  successfulReferrals: number;
  earnings: number;
}> {
  try {
    // This would fetch actual data from your database
    // For now, returning mock data
    return {
      totalReferrals: 5,
      pendingReferrals: 2,
      successfulReferrals: 3,
      earnings: 29.85 // $9.95 per successful referral
    };
  } catch (error) {
    console.error("Error getting referral stats:", error);
    return {
      totalReferrals: 0,
      pendingReferrals: 0,
      successfulReferrals: 0,
      earnings: 0
    };
  }
}

/**
 * Determines if a signup came from a referral and processes it
 * 
 * @param referralCode The referral code from the URL
 * @param newUser The newly created user
 */
export async function processSignupReferral(referralCode: string | null, newUser: User): Promise<void> {
  if (referralCode) {
    try {
      // 1. Validate the referral code
      // 2. Track the referral
      await trackReferral(referralCode, newUser.uid);
      
      // 3. Store the referral relationship
      // This would be implemented to update your database
      
      console.log(`Processed signup referral: ${referralCode} for new user ${newUser.uid}`);
    } catch (error) {
      console.error("Error processing signup referral:", error);
    }
  }
} 
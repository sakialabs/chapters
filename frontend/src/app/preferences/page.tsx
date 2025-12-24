"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ThemeToggle } from "@/components/ThemeToggle"
import { PageTransition, TabTransition } from "@/components/PageTransition"
import { MuseOnboarding, OnboardingPreferences } from "@/components/onboarding/MuseOnboarding"
import { authService } from "@/services/auth"
import {
  useBookProfile,
  useUpdatePassword,
  useUpdateBookProfile,
  useUpdateAvatar,
} from "@/hooks/useUser"
import { AnimatePresence } from "framer-motion"

const AVATAR_OPTIONS = Array.from({ length: 20 }, (_, i) => `/avatars/avatar${i + 1}.png`)

export default function SettingsPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<"bindings" | "book" | "muse">("bindings")
  const [showMuseOnboarding, setShowMuseOnboarding] = useState(false)
  
  // Fetch book profile
  const { data: bookProfile, isLoading: isLoadingProfile } = useBookProfile()
  
  // Mutations
  const updatePasswordMutation = useUpdatePassword()
  const updateProfileMutation = useUpdateBookProfile()
  const updateAvatarMutation = useUpdateAvatar()
  
  // Account settings
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [passwordError, setPasswordError] = useState("")
  const [passwordSuccess, setPasswordSuccess] = useState("")
  
  // Profile settings
  const [displayName, setDisplayName] = useState("")
  const [bio, setBio] = useState("")
  const [selectedAvatar, setSelectedAvatar] = useState<string | null>(null)
  const [isPrivate, setIsPrivate] = useState(false)
  const [profileError, setProfileError] = useState("")
  const [profileSuccess, setProfileSuccess] = useState("")

  // Load profile data when available
  useEffect(() => {
    if (bookProfile) {
      setDisplayName(bookProfile.display_name || "")
      setBio(bookProfile.bio || "")
      setSelectedAvatar(bookProfile.cover_image_url)
      setIsPrivate(bookProfile.is_private)
    }
  }, [bookProfile])

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    setPasswordError("")
    setPasswordSuccess("")

    if (newPassword !== confirmPassword) {
      setPasswordError("Passwords do not match")
      return
    }

    if (newPassword.length < 8) {
      setPasswordError("Password must be at least 8 characters")
      return
    }

    // Strong password validation
    if (!/[A-Z]/.test(newPassword)) {
      setPasswordError("Password must contain at least one uppercase letter")
      return
    }

    if (!/[a-z]/.test(newPassword)) {
      setPasswordError("Password must contain at least one lowercase letter")
      return
    }

    if (!/\d/.test(newPassword)) {
      setPasswordError("Password must contain at least one number")
      return
    }

    if (!/[!@#$%^&*(),.?":{}|<>_\-+=\[\]\\\/;'`~]/.test(newPassword)) {
      setPasswordError("Password must contain at least one special character")
      return
    }

    try {
      await updatePasswordMutation.mutateAsync({
        current_password: currentPassword,
        new_password: newPassword,
      })
      setPasswordSuccess("Password updated successfully")
      setCurrentPassword("")
      setNewPassword("")
      setConfirmPassword("")
    } catch (error: any) {
      setPasswordError(
        error.response?.data?.detail || "Failed to update password. Please check your current password."
      )
    }
  }

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    setProfileError("")
    setProfileSuccess("")

    try {
      await updateProfileMutation.mutateAsync({
        display_name: displayName,
        bio: bio,
        is_private: isPrivate,
      })
      setProfileSuccess("Profile updated successfully")
    } catch (error: any) {
      setProfileError(error.response?.data?.detail || "Failed to update profile")
    }
  }

  const handleAvatarSelect = async (avatar: string) => {
    setSelectedAvatar(avatar)
    try {
      await updateAvatarMutation.mutateAsync(avatar)
    } catch (error) {
      console.error("Failed to update avatar:", error)
    }
  }

  const handleLogout = async () => {
    try {
      await authService.logout()
    } catch (error) {
      // Suppress logout errors - token cleanup happens regardless
      console.debug('Logout completed')
    } finally {
      router.push("/")
    }
  }

  const handleMuseOnboardingComplete = (preferences: OnboardingPreferences) => {
    setShowMuseOnboarding(false)
    // Preferences are already saved by the onboarding component
  }

  const handleMuseOnboardingSkip = () => {
    setShowMuseOnboarding(false)
  }

  // Show Muse onboarding if requested
  if (showMuseOnboarding) {
    return (
      <MuseOnboarding
        onComplete={handleMuseOnboardingComplete}
        onSkip={handleMuseOnboardingSkip}
      />
    )
  }

  return (
    <PageTransition>
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-serif font-bold text-foreground">Preferences</h1>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <Link href="/library">
              <Button variant="ghost">← Library</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Tabs */}
      <div className="border-b border-border bg-card">
        <div className="container mx-auto px-4">
          <div className="flex gap-8">
            <button
              onClick={() => setActiveTab("bindings")}
              className={`py-4 border-b-2 transition-colors ${
                activeTab === "bindings"
                  ? "border-primary text-foreground font-medium"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              Bindings
            </button>
            <button
              onClick={() => setActiveTab("book")}
              className={`py-4 border-b-2 transition-colors ${
                activeTab === "book"
                  ? "border-primary text-foreground font-medium"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              Your Book
            </button>
            <button
              onClick={() => setActiveTab("muse")}
              className={`py-4 border-b-2 transition-colors ${
                activeTab === "muse"
                  ? "border-primary text-foreground font-medium"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              Muse
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <main className="container mx-auto px-4 py-12">
        <AnimatePresence mode="wait">
        {/* Bindings Tab */}
        {activeTab === "bindings" && (
          <TabTransition key="bindings">
          <div className="max-w-2xl mx-auto">
            <div className="bg-card border border-border rounded-lg p-8">
              <h2 className="text-2xl font-serif font-semibold text-foreground mb-3">
                Bindings
              </h2>
              <p className="text-sm text-muted-foreground mb-8">
                These are the bindings that hold your Book together. They're practical, quiet, and rarely touched — but important.
              </p>

              <h3 className="text-xl font-serif font-semibold text-foreground mb-3">
                Update Your Binding
              </h3>
              <p className="text-sm text-muted-foreground mb-6">
                Refresh the binding that protects your Book.
              </p>

              <form onSubmit={handlePasswordUpdate} className="space-y-6">
                <div>
                  <Label htmlFor="current-password">Enter your current binding</Label>
                  <div className="relative mt-2">
                    <Input
                      id="current-password"
                      type={showCurrentPassword ? "text" : "password"}
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      required
                      className="pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                      tabIndex={-1}
                    >
                      {showCurrentPassword ? (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                          <line x1="1" y1="1" x2="23" y2="23" />
                        </svg>
                      ) : (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                          <circle cx="12" cy="12" r="3" />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>

                <div>
                  <Label htmlFor="new-password">Choose a stronger binding</Label>
                  <div className="relative mt-2">
                    <Input
                      id="new-password"
                      type={showNewPassword ? "text" : "password"}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      required
                      className="pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                      tabIndex={-1}
                    >
                      {showNewPassword ? (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                          <line x1="1" y1="1" x2="23" y2="23" />
                        </svg>
                      ) : (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                          <circle cx="12" cy="12" r="3" />
                        </svg>
                      )}
                    </button>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Must include: uppercase, lowercase, number, and special character
                  </p>
                </div>

                <div>
                  <Label htmlFor="confirm-password">Re-enter the new binding</Label>
                  <div className="relative mt-2">
                    <Input
                      id="confirm-password"
                      type={showConfirmPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      className="pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                      tabIndex={-1}
                    >
                      {showConfirmPassword ? (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                          <line x1="1" y1="1" x2="23" y2="23" />
                        </svg>
                      ) : (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                          <circle cx="12" cy="12" r="3" />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>

                {passwordError && (
                  <p className="text-sm text-red-500">{passwordError}</p>
                )}

                {passwordSuccess && (
                  <p className="text-sm text-green-600 dark:text-green-400">
                    {passwordSuccess}
                  </p>
                )}

                <Button type="submit" disabled={updatePasswordMutation.isPending}>
                  {updatePasswordMutation.isPending ? "Updating..." : "Update Binding"}
                </Button>
              </form>

              <div className="mt-12 pt-8 border-t border-border">
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  Close the Book
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  You can always return where you left off.
                </p>
                <Button variant="outline" onClick={handleLogout}>
                  Logout
                </Button>
              </div>
            </div>
          </div>
          </TabTransition>
        )}

        {/* Your Book Tab */}
        {activeTab === "book" && (
          <TabTransition key="book">
          <div className="max-w-4xl mx-auto">
            {isLoadingProfile ? (
              <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : (
              <div className="bg-card border border-border rounded-lg p-8">
                <h2 className="text-2xl font-serif font-semibold text-foreground mb-3">
                  Your Book
                </h2>
                <p className="text-sm text-muted-foreground mb-8">
                  This is how your Book appears on the shelf. Take your time. Nothing here needs to be perfect.
                </p>

                <form onSubmit={handleProfileUpdate} className="space-y-8">
                  {/* Book Title */}
                  <div>
                    <Label htmlFor="display-name">Book Title</Label>
                    <Input
                      id="display-name"
                      type="text"
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      placeholder="This is how your Book appears to readers"
                    />
                  </div>

                  {/* Inside Flap */}
                  <div>
                    <Label htmlFor="bio">Inside Flap</Label>
                    <p className="text-xs text-muted-foreground mb-2">
                      A short note to the reader. Themes, moods, fragments — whatever fits.
                    </p>
                    <textarea
                      id="bio"
                      value={bio}
                      onChange={(e) => setBio(e.target.value.slice(0, 500))}
                      placeholder="Tell readers what this Book is about..."
                      className="w-full min-h-[120px] px-3 py-2 bg-background border border-border rounded-md text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      {bio.length}/500 characters. Brevity is part of the craft.
                    </p>
                  </div>

                  {/* Book Portrait */}
                  <div>
                    <Label>Book Portrait</Label>
                    <p className="text-sm text-muted-foreground mb-4">
                      Choose a portrait that feels like this Book. You can change it anytime.
                    </p>

                    {/* Avatar Grid */}
                    <div className="grid grid-cols-5 sm:grid-cols-10 gap-3">
                      {AVATAR_OPTIONS.map((avatar, index) => (
                        <button
                          key={avatar}
                          type="button"
                          onClick={() => handleAvatarSelect(avatar)}
                          disabled={updateAvatarMutation.isPending}
                          className={`relative aspect-square rounded-full overflow-hidden border-2 transition-all hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed ${
                            selectedAvatar === avatar
                              ? "border-primary ring-2 ring-primary ring-offset-2 ring-offset-background"
                              : "border-border hover:border-primary"
                          }`}
                        >
                          <Image
                            src={avatar}
                            alt={`Portrait ${index + 1}`}
                            fill
                            className="object-cover"
                          />
                        </button>
                      ))}
                    </div>
                    {updateAvatarMutation.isSuccess && (
                      <p className="text-xs text-green-600 dark:text-green-400 mt-2">
                        Portrait updated.
                      </p>
                    )}
                  </div>

                  {/* Book Visibility */}
                  <div className="flex items-start gap-3">
                    <input
                      id="is-private"
                      type="checkbox"
                      checked={isPrivate}
                      onChange={(e) => setIsPrivate(e.target.checked)}
                      className="w-4 h-4 mt-1 rounded border-border text-primary focus:ring-2 focus:ring-primary"
                    />
                    <div>
                      <Label htmlFor="is-private" className="cursor-pointer">
                        Book Visibility
                      </Label>
                      <p className="text-xs text-muted-foreground mt-1">
                        {isPrivate ? "Private Book — Only people you approve may read" : "Public Book — Anyone may read this Book"}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        You can change this whenever you like.
                      </p>
                    </div>
                  </div>

                  {profileError && (
                    <p className="text-sm text-red-500">{profileError}</p>
                  )}

                  {profileSuccess && (
                    <p className="text-sm text-green-600 dark:text-green-400">
                      Your Book has been updated.
                    </p>
                  )}

                  <Button type="submit" disabled={updateProfileMutation.isPending}>
                    {updateProfileMutation.isPending ? "Saving..." : "Update Book"}
                  </Button>
                </form>
              </div>
            )}
          </div>
          </TabTransition>
        )}

        {/* Muse Tab */}
        {activeTab === "muse" && (
          <TabTransition key="muse">
          <div className="max-w-2xl mx-auto">
            <div className="bg-card border border-border rounded-lg p-8">
              <h2 className="text-2xl font-serif font-semibold text-foreground mb-3">
                Muse
              </h2>
              <p className="text-sm text-muted-foreground mb-8">
                Muse is your creative companion. Update how and when Muse shows up for you.
              </p>

              <div className="space-y-6">
                <div className="bg-secondary/10 border border-secondary/30 rounded-md p-4">
                  <p className="text-sm text-foreground mb-2">
                    Your current Muse settings were configured during onboarding.
                  </p>
                  <p className="text-xs text-muted-foreground">
                    You can retake the onboarding to update your preferences for how Muse interacts with you, your expression style, and tone.
                  </p>
                </div>

                <Button 
                  size="lg"
                  onClick={() => setShowMuseOnboarding(true)}
                  className="w-full sm:w-auto"
                >
                  Update Muse Preferences
                </Button>

                <div className="pt-6 border-t border-border">
                  <h3 className="text-lg font-serif font-semibold text-foreground mb-3">
                    About Muse
                  </h3>
                  <div className="text-sm text-muted-foreground space-y-2">
                    <p>Muse can help you with:</p>
                    <ul className="list-disc list-inside space-y-1 ml-2">
                      <li>Writing prompts and first lines</li>
                      <li>Chapter titles and mood suggestions</li>
                      <li>Tightening and refining your text</li>
                      <li>Exploring different tones</li>
                    </ul>
                    <p className="pt-2">
                      Muse never writes for you — only offers suggestions you can use, modify, or ignore.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          </TabTransition>
        )}
        </AnimatePresence>
      </main>
    </div>
    </PageTransition>
  )
}

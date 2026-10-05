"use client";

import { useState, useId, type FormEvent } from "react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

import { Input } from "@/components/ui/input";
import { FancyButton } from "./fancy-button";
import { Icons } from "./icons";
import { EyeIcon, EyeOffIcon } from "lucide-react";

const socials = [
  { icon: Icons.Google, name: "google" },
  { icon: Icons.Apple, name: "apple" },
  { icon: Icons.GitHub, name: "github" },
];

export interface SignUpProps {
  onSignUp?: () => void;
  onSocialSignUp?: (provider: string) => void;
  onSignIn?: () => void;
  onHome?: () => void;
}
export function SignUp({
  onSignUp,
  onSocialSignUp,
  onSignIn,
  onHome,
}: SignUpProps) {
  const id = useId();
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    event.currentTarget.reset();
    setShowPassword(false);
    onSignUp?.();
  };
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="[&_button]:cursor-pointer [&_button:focus-visible]:outline-2 [&_button:focus-visible]:outline-offset-4 [&_button:focus-visible]:outline-ring w-full max-w-xl rounded-4xl @3xl:max-w-4xl @3xl:bg-muted @3xl:p-1">
      <section className="grid grid-cols-1 @3xl:grid-cols-2">
        <div className="flex flex-col gap-6 rounded-3xl bg-card p-6 shadow-elevated-lg">
          <div className="flex flex-col items-center gap-4">
            <FancyButton
              type="button"
              size="icon-lg"
              className="size-14 rounded-xl"
              aria-label="Home"
              onClick={onHome}
            >
              <Icons.Logo className="size-10" />
            </FancyButton>
            <div className="text-center">
              <h2 className="text-xl font-semibold">Create your account</h2>
              <p className="text-md text-muted-foreground">
                Get started in just a few steps.
              </p>
            </div>
          </div>

          <div className="flex gap-3 *:h-10 *:flex-1 *:[&>svg]:size-5">
            {socials.map(({ icon: Icon, name }) => (
              <Button
                key={name}
                type="button"
                variant="secondary"
                aria-label={`Sign up with ${name}`}
                onClick={() => onSocialSignUp?.(name)}
              >
                <Icon />
              </Button>
            ))}
          </div>

          <div className="relative text-center text-xs text-muted-foreground uppercase before:absolute before:inset-x-0 before:top-1/2 before:h-px before:bg-border/50 before:content-['']">
            <span className="relative bg-card px-2">or with</span>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <div className="flex flex-col gap-1">
              <label htmlFor={`${id}-name`} className="text-sm font-medium">
                Full Name <span className="text-primary">*</span>
              </label>
              <Input
                id={`${id}-name`}
                name="name"
                autoComplete="name"
                required
                type="text"
                placeholder="Diar Muradi"
                className="h-10"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label htmlFor={`${id}-email`} className="text-sm font-medium">
                Email <span className="text-primary">*</span>
              </label>
              <Input
                id={`${id}-email`}
                name="email"
                autoComplete="email"
                required
                type="email"
                placeholder="contact@diarmuradi.com"
                className="h-10"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label htmlFor={`${id}-password`} className="text-sm font-medium">
                Password <span className="text-primary">*</span>
              </label>
              <div className="relative">
                <Input
                  id={`${id}-password`}
                  name="password"
                  autoComplete="new-password"
                  required
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••••"
                  className="h-10 pr-12"
                />
                <div className="absolute right-0 inset-y-0 flex items-center">
                  <Button
                    size="icon"
                    variant="ghost"
                    className="size-10"
                    aria-pressed={showPassword}
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                  >
                    {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                  </Button>
                </div>
              </div>
            </div>

            <FancyButton type="submit" className="h-10">
              Create Account
            </FancyButton>
          </form>

          <p className="text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Button
              onClick={onSignIn}
              type="button"
              variant="link"
              className="h-auto p-0"
            >
              Sign in
            </Button>
          </p>
        </div>

        <div className="hidden @3xl:flex @3xl:flex-col @3xl:justify-end @3xl:p-12">
          <div className="mt-auto flex flex-col gap-6">
            <p className="text-lg leading-relaxed">
              &ldquo;Signing up took less than 30 seconds. I was{" "}
              <span className="font-medium text-primary">in my dashboard</span>{" "}
              before my coffee even cooled down.&rdquo;
            </p>
            <div className="flex items-center gap-3">
              <Avatar className="size-10">
                <AvatarImage
                  src="https://cdn.21st.dev/assets/localized/b881fc6e5d91d95f912abd2f45508332c7a398d9dd53c136c6c0a2d500c8fc7e.png"
                  alt="Lee Robinson"
                />
                <AvatarFallback>L</AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-semibold">Lee Robinson</p>
                <p className="text-xs text-muted-foreground">VP of DevRel</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default SignUp;

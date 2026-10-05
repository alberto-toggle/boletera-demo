"use client";
import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import styles from "./sign-in-card-2.module.css";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useTransform,
  useReducedMotion,
} from "framer-motion";
import { Mail, Lock, Eye, EyeClosed, ArrowRight } from "lucide-react";

export interface SignInCardProps {
  onSignIn?: () => void;
  onGoogleSignIn?: () => void;
  onResetPassword?: () => void;
  onSignUp?: () => void;
}

export function SignInCard({
  onSignIn,
  onGoogleSignIn,
  onResetPassword,
  onSignUp,
}: SignInCardProps) {
  const id = React.useId();
  const reduced = useReducedMotion();
  const timer = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    [],
  );
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [focusedInput, setFocusedInput] = useState<"email" | "password" | null>(
    null,
  );
  const [rememberMe, setRememberMe] = useState(false);

  // For 3D card effect - increased rotation range for more pronounced 3D effect
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const rotateX = useTransform(mouseY, [-300, 300], [10, -10]); // Increased from 5/-5 to 10/-10
  const rotateY = useTransform(mouseX, [-300, 300], [-10, 10]); // Increased from -5/5 to -10/10

  const handleMouseMove = (e: React.MouseEvent) => {
    if (reduced) return;
    const rect = e.currentTarget.getBoundingClientRect();
    mouseX.set(e.clientX - rect.left - rect.width / 2);
    mouseY.set(e.clientY - rect.top - rect.height / 2);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (timer.current) return;
    setIsLoading(true);
    timer.current = setTimeout(() => {
      timer.current = null;
      setIsLoading(false);
      setPassword("");
      onSignIn?.();
    }, 2000);
  };

  return (
    <div
      className={`${styles.root} min-h-[760px] w-full px-5 py-14 bg-black text-white relative overflow-hidden flex items-center justify-center`}
    >
      {/* Background gradient effect - matches the purple OnlyPipe style */}
      <div className="absolute inset-0 bg-gradient-to-b from-purple-500/40 via-purple-700/50 to-black" />

      {/* Subtle noise texture overlay */}
      <div
        className="absolute inset-0 opacity-[0.03] mix-blend-soft-light"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          backgroundSize: "200px 200px",
        }}
      />

      {/* Top radial glow */}
      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-[120vh] h-[60vh] rounded-b-[50%] bg-purple-400/20 blur-[80px]" />
      <motion.div
        className="absolute top-0 left-1/2 transform -translate-x-1/2 w-[100vh] h-[60vh] rounded-b-full bg-purple-300/20 blur-[60px]"
        animate={
          reduced
            ? { opacity: 1 }
            : {
                opacity: [0.15, 0.3, 0.15],
                scale: [0.98, 1.02, 0.98],
              }
        }
        transition={
          reduced
            ? { duration: 0 }
            : {
                duration: 8,
                repeat: Infinity,
                repeatType: "mirror",
              }
        }
      />
      <motion.div
        className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-[90vh] h-[90vh] rounded-t-full bg-purple-400/20 blur-[60px]"
        animate={
          reduced
            ? { opacity: 1 }
            : {
                opacity: [0.3, 0.5, 0.3],
                scale: [1, 1.1, 1],
              }
        }
        transition={
          reduced
            ? { duration: 0 }
            : {
                duration: 6,
                repeat: Infinity,
                repeatType: "mirror",
                delay: 1,
              }
        }
      />

      {/* Animated glow spots */}
      <div className="absolute left-1/4 top-1/4 w-96 h-96 bg-white/5 rounded-full blur-[100px] animate-pulse opacity-40" />
      <div className="absolute right-1/4 bottom-1/4 w-96 h-96 bg-white/5 rounded-full blur-[100px] animate-pulse delay-1000 opacity-40" />

      <motion.div
        initial={reduced ? false : { opacity: 0, y: 20 }}
        animate={reduced ? { opacity: 1 } : { opacity: 1, y: 0 }}
        transition={reduced ? { duration: 0 } : { duration: 0.8 }}
        className="w-full max-w-sm relative z-10"
        style={{ perspective: 1500 }}
      >
        <motion.div
          className="relative"
          style={{
            rotateX: reduced ? 0 : rotateX,
            rotateY: reduced ? 0 : rotateY,
          }}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          whileHover={reduced ? undefined : { z: 10 }}
        >
          <div className="relative group">
            {/* Card glow effect - reduced intensity */}
            <motion.div
              className="absolute -inset-[1px] rounded-2xl opacity-0 group-hover:opacity-70 transition-opacity duration-700"
              animate={
                reduced
                  ? { opacity: 1 }
                  : {
                      boxShadow: [
                        "0 0 10px 2px rgba(255,255,255,0.03)",
                        "0 0 15px 5px rgba(255,255,255,0.05)",
                        "0 0 10px 2px rgba(255,255,255,0.03)",
                      ],
                      opacity: [0.2, 0.4, 0.2],
                    }
              }
              transition={
                reduced
                  ? { duration: 0 }
                  : {
                      duration: 4,
                      repeat: Infinity,
                      ease: "easeInOut",
                      repeatType: "mirror",
                    }
              }
            />

            {/* Traveling light beam effect - reduced opacity */}
            <div className="absolute -inset-[1px] rounded-2xl overflow-hidden">
              {/* Top light beam - enhanced glow */}
              <motion.div
                className="absolute top-0 left-0 h-[3px] w-[50%] bg-gradient-to-r from-transparent via-white to-transparent opacity-70"
                initial={reduced ? false : { filter: "blur(2px)" }}
                animate={
                  reduced
                    ? { opacity: 1 }
                    : {
                        left: ["-50%", "100%"],
                        opacity: [0.3, 0.7, 0.3],
                        filter: ["blur(1px)", "blur(2.5px)", "blur(1px)"],
                      }
                }
                transition={
                  reduced
                    ? { duration: 0 }
                    : {
                        left: {
                          duration: 2.5,
                          ease: "easeInOut",
                          repeat: Infinity,
                          repeatDelay: 1,
                        },
                        opacity: {
                          duration: 1.2,
                          repeat: Infinity,
                          repeatType: "mirror",
                        },
                        filter: {
                          duration: 1.5,
                          repeat: Infinity,
                          repeatType: "mirror",
                        },
                      }
                }
              />

              {/* Right light beam - enhanced glow */}
              <motion.div
                className="absolute top-0 right-0 h-[50%] w-[3px] bg-gradient-to-b from-transparent via-white to-transparent opacity-70"
                initial={reduced ? false : { filter: "blur(2px)" }}
                animate={
                  reduced
                    ? { opacity: 1 }
                    : {
                        top: ["-50%", "100%"],
                        opacity: [0.3, 0.7, 0.3],
                        filter: ["blur(1px)", "blur(2.5px)", "blur(1px)"],
                      }
                }
                transition={
                  reduced
                    ? { duration: 0 }
                    : {
                        top: {
                          duration: 2.5,
                          ease: "easeInOut",
                          repeat: Infinity,
                          repeatDelay: 1,
                          delay: 0.6,
                        },
                        opacity: {
                          duration: 1.2,
                          repeat: Infinity,
                          repeatType: "mirror",
                          delay: 0.6,
                        },
                        filter: {
                          duration: 1.5,
                          repeat: Infinity,
                          repeatType: "mirror",
                          delay: 0.6,
                        },
                      }
                }
              />

              {/* Bottom light beam - enhanced glow */}
              <motion.div
                className="absolute bottom-0 right-0 h-[3px] w-[50%] bg-gradient-to-r from-transparent via-white to-transparent opacity-70"
                initial={reduced ? false : { filter: "blur(2px)" }}
                animate={
                  reduced
                    ? { opacity: 1 }
                    : {
                        right: ["-50%", "100%"],
                        opacity: [0.3, 0.7, 0.3],
                        filter: ["blur(1px)", "blur(2.5px)", "blur(1px)"],
                      }
                }
                transition={
                  reduced
                    ? { duration: 0 }
                    : {
                        right: {
                          duration: 2.5,
                          ease: "easeInOut",
                          repeat: Infinity,
                          repeatDelay: 1,
                          delay: 1.2,
                        },
                        opacity: {
                          duration: 1.2,
                          repeat: Infinity,
                          repeatType: "mirror",
                          delay: 1.2,
                        },
                        filter: {
                          duration: 1.5,
                          repeat: Infinity,
                          repeatType: "mirror",
                          delay: 1.2,
                        },
                      }
                }
              />

              {/* Left light beam - enhanced glow */}
              <motion.div
                className="absolute bottom-0 left-0 h-[50%] w-[3px] bg-gradient-to-b from-transparent via-white to-transparent opacity-70"
                initial={reduced ? false : { filter: "blur(2px)" }}
                animate={
                  reduced
                    ? { opacity: 1 }
                    : {
                        bottom: ["-50%", "100%"],
                        opacity: [0.3, 0.7, 0.3],
                        filter: ["blur(1px)", "blur(2.5px)", "blur(1px)"],
                      }
                }
                transition={
                  reduced
                    ? { duration: 0 }
                    : {
                        bottom: {
                          duration: 2.5,
                          ease: "easeInOut",
                          repeat: Infinity,
                          repeatDelay: 1,
                          delay: 1.8,
                        },
                        opacity: {
                          duration: 1.2,
                          repeat: Infinity,
                          repeatType: "mirror",
                          delay: 1.8,
                        },
                        filter: {
                          duration: 1.5,
                          repeat: Infinity,
                          repeatType: "mirror",
                          delay: 1.8,
                        },
                      }
                }
              />

              {/* Subtle corner glow spots - reduced opacity */}
              <motion.div
                className="absolute top-0 left-0 h-[5px] w-[5px] rounded-full bg-white/40 blur-[1px]"
                animate={
                  reduced
                    ? { opacity: 1 }
                    : {
                        opacity: [0.2, 0.4, 0.2],
                      }
                }
                transition={
                  reduced
                    ? { duration: 0 }
                    : {
                        duration: 2,
                        repeat: Infinity,
                        repeatType: "mirror",
                      }
                }
              />
              <motion.div
                className="absolute top-0 right-0 h-[8px] w-[8px] rounded-full bg-white/60 blur-[2px]"
                animate={
                  reduced
                    ? { opacity: 1 }
                    : {
                        opacity: [0.2, 0.4, 0.2],
                      }
                }
                transition={
                  reduced
                    ? { duration: 0 }
                    : {
                        duration: 2.4,
                        repeat: Infinity,
                        repeatType: "mirror",
                        delay: 0.5,
                      }
                }
              />
              <motion.div
                className="absolute bottom-0 right-0 h-[8px] w-[8px] rounded-full bg-white/60 blur-[2px]"
                animate={
                  reduced
                    ? { opacity: 1 }
                    : {
                        opacity: [0.2, 0.4, 0.2],
                      }
                }
                transition={
                  reduced
                    ? { duration: 0 }
                    : {
                        duration: 2.2,
                        repeat: Infinity,
                        repeatType: "mirror",
                        delay: 1,
                      }
                }
              />
              <motion.div
                className="absolute bottom-0 left-0 h-[5px] w-[5px] rounded-full bg-white/40 blur-[1px]"
                animate={
                  reduced
                    ? { opacity: 1 }
                    : {
                        opacity: [0.2, 0.4, 0.2],
                      }
                }
                transition={
                  reduced
                    ? { duration: 0 }
                    : {
                        duration: 2.3,
                        repeat: Infinity,
                        repeatType: "mirror",
                        delay: 1.5,
                      }
                }
              />
            </div>

            {/* Card border glow - reduced opacity */}
            <div className="absolute -inset-[0.5px] rounded-2xl bg-gradient-to-r from-white/3 via-white/7 to-white/3 opacity-0 group-hover:opacity-70 transition-opacity duration-500" />

            {/* Glass card background */}
            <div className="relative bg-black/40 backdrop-blur-xl rounded-2xl p-6 border border-white/[0.05] shadow-2xl overflow-hidden">
              {/* Subtle card inner patterns */}
              <div
                className="pointer-events-none absolute inset-0 opacity-[0.03]"
                style={{
                  backgroundImage: `linear-gradient(135deg, white 0.5px, transparent 0.5px), linear-gradient(45deg, white 0.5px, transparent 0.5px)`,
                  backgroundSize: "30px 30px",
                }}
              />

              {/* Logo and header */}
              <div className="text-center space-y-1 mb-5">
                <motion.div
                  initial={reduced ? false : { scale: 0.5, opacity: 0 }}
                  animate={reduced ? { opacity: 1 } : { scale: 1, opacity: 1 }}
                  transition={
                    reduced
                      ? { duration: 0 }
                      : { type: "spring", duration: 0.8 }
                  }
                  className="mx-auto w-10 h-10 rounded-full border border-white/10 flex items-center justify-center relative overflow-hidden"
                >
                  {/* Logo placeholder - would be an SVG in practice */}
                  {/* <!-- SVG_LOGO --> */}
                  <span className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-b from-white to-white/70">
                    S
                  </span>

                  {/* Inner lighting effect */}
                  <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-50" />
                </motion.div>

                <motion.h2
                  initial={reduced ? false : { opacity: 0, y: 10 }}
                  animate={reduced ? { opacity: 1 } : { opacity: 1, y: 0 }}
                  transition={reduced ? { duration: 0 } : { delay: 0.2 }}
                  className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-white to-white/80"
                >
                  Welcome Back
                </motion.h2>

                <motion.p
                  initial={reduced ? false : { opacity: 0 }}
                  animate={reduced ? { opacity: 1 } : { opacity: 1 }}
                  transition={reduced ? { duration: 0 } : { delay: 0.3 }}
                  className="text-white/60 text-xs"
                >
                  Sign in to continue to StyleMe
                </motion.p>
              </div>

              {/* Login form */}
              <form
                onSubmit={handleSubmit}
                aria-busy={isLoading}
                className="space-y-4"
              >
                <motion.div className="space-y-3">
                  {/* Email input */}
                  <motion.div
                    className={`relative ${focusedInput === "email" ? "z-10" : ""}`}
                    whileFocus={reduced ? undefined : { scale: 1.02 }}
                    whileHover={reduced ? undefined : { scale: 1.01 }}
                    transition={
                      reduced
                        ? { duration: 0 }
                        : { type: "spring", stiffness: 400, damping: 25 }
                    }
                  >
                    <div className="absolute -inset-[0.5px] bg-gradient-to-r from-white/10 via-white/5 to-white/10 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-300" />

                    <div className="relative flex items-center overflow-hidden rounded-lg">
                      <Mail
                        className={`absolute left-3 w-4 h-4 transition-all duration-300 ${
                          focusedInput === "email"
                            ? "text-white"
                            : "text-white/40"
                        }`}
                      />

                      <label className="sr-only" htmlFor={`${id}-email`}>
                        Email address
                      </label>
                      <Input
                        id={`${id}-email`}
                        name="email"
                        autoComplete="email"
                        required
                        type="email"
                        placeholder="Email address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        onFocus={() => setFocusedInput("email")}
                        onBlur={() => setFocusedInput(null)}
                        className="w-full bg-white/5 border-transparent focus:border-white/20 text-white placeholder:text-white/30 h-10 transition-all duration-300 pl-10 pr-3 focus:bg-white/10"
                      />

                      {/* Input highlight effect */}
                      {focusedInput === "email" && (
                        <motion.div
                          layoutId="input-highlight"
                          className="absolute inset-0 bg-white/5 -z-10"
                          initial={reduced ? false : { opacity: 0 }}
                          animate={reduced ? { opacity: 1 } : { opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={
                            reduced ? { duration: 0 } : { duration: 0.2 }
                          }
                        />
                      )}
                    </div>
                  </motion.div>

                  {/* Password input */}
                  <motion.div
                    className={`relative ${focusedInput === "password" ? "z-10" : ""}`}
                    whileFocus={reduced ? undefined : { scale: 1.02 }}
                    whileHover={reduced ? undefined : { scale: 1.01 }}
                    transition={
                      reduced
                        ? { duration: 0 }
                        : { type: "spring", stiffness: 400, damping: 25 }
                    }
                  >
                    <div className="absolute -inset-[0.5px] bg-gradient-to-r from-white/10 via-white/5 to-white/10 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-300" />

                    <div className="relative flex items-center overflow-hidden rounded-lg">
                      <Lock
                        className={`absolute left-3 w-4 h-4 transition-all duration-300 ${
                          focusedInput === "password"
                            ? "text-white"
                            : "text-white/40"
                        }`}
                      />

                      <label className="sr-only" htmlFor={`${id}-password`}>
                        Password
                      </label>
                      <Input
                        id={`${id}-password`}
                        name="password"
                        autoComplete="current-password"
                        required
                        type={showPassword ? "text" : "password"}
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        onFocus={() => setFocusedInput("password")}
                        onBlur={() => setFocusedInput(null)}
                        className="w-full bg-white/5 border-transparent focus:border-white/20 text-white placeholder:text-white/30 h-10 transition-all duration-300 pl-10 pr-10 focus:bg-white/10"
                      />

                      {/* Toggle password visibility */}
                      <button
                        type="button"
                        aria-label={
                          showPassword ? "Hide password" : "Show password"
                        }
                        aria-pressed={showPassword}
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-0 inset-y-0 w-10 flex items-center justify-center cursor-pointer"
                      >
                        {showPassword ? (
                          <Eye className="w-4 h-4 text-white/40 hover:text-white transition-colors duration-300" />
                        ) : (
                          <EyeClosed className="w-4 h-4 text-white/40 hover:text-white transition-colors duration-300" />
                        )}
                      </button>

                      {/* Input highlight effect */}
                      {focusedInput === "password" && (
                        <motion.div
                          layoutId="input-highlight"
                          className="absolute inset-0 bg-white/5 -z-10"
                          initial={reduced ? false : { opacity: 0 }}
                          animate={reduced ? { opacity: 1 } : { opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={
                            reduced ? { duration: 0 } : { duration: 0.2 }
                          }
                        />
                      )}
                    </div>
                  </motion.div>
                </motion.div>

                {/* Remember me & Forgot password */}
                <div className="flex flex-wrap gap-3 items-center justify-between pt-1">
                  <div className="flex items-center space-x-2">
                    <div className="relative">
                      <input
                        id={`${id}-remember`}
                        name="remember-me"
                        type="checkbox"
                        checked={rememberMe}
                        onChange={() => setRememberMe(!rememberMe)}
                        className="appearance-none h-4 w-4 rounded border border-white/20 bg-white/5 checked:bg-white checked:border-white focus:outline-none focus:ring-1 focus:ring-white/30 transition-all duration-200"
                      />
                      {rememberMe && (
                        <motion.div
                          initial={reduced ? false : { opacity: 0, scale: 0.5 }}
                          animate={
                            reduced ? { opacity: 1 } : { opacity: 1, scale: 1 }
                          }
                          className="absolute inset-0 flex items-center justify-center text-black pointer-events-none"
                        >
                          {/* <!-- SVG_CHECKMARK --> */}
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="12"
                            height="12"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="3"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <polyline points="20 6 9 17 4 12"></polyline>
                          </svg>
                        </motion.div>
                      )}
                    </div>
                    <label
                      htmlFor={`${id}-remember`}
                      className="text-xs text-white/60 hover:text-white/80 transition-colors duration-200"
                    >
                      Remember me
                    </label>
                  </div>

                  <div className="text-xs relative group/link">
                    <button
                      type="button"
                      onClick={onResetPassword}
                      className="text-white/60 hover:text-white transition-colors duration-200"
                    >
                      Forgot password?
                    </button>
                  </div>
                </div>

                {/* Sign in button */}
                <motion.button
                  whileHover={reduced ? undefined : { scale: 1.02 }}
                  whileTap={reduced ? undefined : { scale: 0.98 }}
                  type="submit"
                  disabled={isLoading}
                  className="w-full relative group/button mt-5"
                >
                  {/* Button glow effect - reduced intensity */}
                  <div className="absolute inset-0 bg-white/10 rounded-lg blur-lg opacity-0 group-hover/button:opacity-70 transition-opacity duration-300" />

                  <div className="relative overflow-hidden bg-white text-black font-medium h-10 rounded-lg transition-all duration-300 flex items-center justify-center">
                    {/* Button background animation */}
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/30 to-white/0 -z-10"
                      animate={
                        reduced
                          ? { opacity: 1 }
                          : {
                              x: ["-100%", "100%"],
                            }
                      }
                      transition={
                        reduced
                          ? { duration: 0 }
                          : {
                              duration: 1.5,
                              ease: "easeInOut",
                              repeat: Infinity,
                              repeatDelay: 1,
                            }
                      }
                      style={{
                        opacity: isLoading ? 1 : 0,
                        transition: "opacity 0.3s ease",
                      }}
                    />

                    <AnimatePresence mode="wait">
                      {isLoading ? (
                        <motion.div
                          key="loading"
                          initial={reduced ? false : { opacity: 0 }}
                          animate={reduced ? { opacity: 1 } : { opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="flex items-center justify-center"
                        >
                          <span className="sr-only">Signing in</span>
                          <div className="w-4 h-4 border-2 border-black/70 border-t-transparent rounded-full animate-spin" />
                        </motion.div>
                      ) : (
                        <motion.span
                          key="button-text"
                          initial={reduced ? false : { opacity: 0 }}
                          animate={reduced ? { opacity: 1 } : { opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="flex items-center justify-center gap-1 text-sm font-medium"
                        >
                          Sign In
                          <ArrowRight className="w-3 h-3 group-hover/button:translate-x-1 transition-transform duration-300" />
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.button>

                {/* Minimal Divider */}
                <div className="relative mt-2 mb-5 flex items-center">
                  <div className="flex-grow border-t border-white/5"></div>
                  <motion.span
                    className="mx-3 text-xs text-white/40"
                    initial={reduced ? false : { opacity: 0.7 }}
                    animate={
                      reduced ? { opacity: 1 } : { opacity: [0.7, 0.9, 0.7] }
                    }
                    transition={
                      reduced
                        ? { duration: 0 }
                        : { duration: 3, repeat: Infinity, ease: "easeInOut" }
                    }
                  >
                    or
                  </motion.span>
                  <div className="flex-grow border-t border-white/5"></div>
                </div>

                {/* Google Sign In */}
                <motion.button
                  whileHover={reduced ? undefined : { scale: 1.02 }}
                  whileTap={reduced ? undefined : { scale: 0.98 }}
                  type="button"
                  onClick={onGoogleSignIn}
                  className="w-full relative group/google"
                >
                  <div className="absolute inset-0 bg-white/5 rounded-lg blur opacity-0 group-hover/google:opacity-70 transition-opacity duration-300" />

                  <div className="relative overflow-hidden bg-white/5 text-white font-medium h-10 rounded-lg border border-white/10 hover:border-white/20 transition-all duration-300 flex items-center justify-center gap-2">
                    {/* <!-- SVG_GOOGLE_LOGO --> */}
                    <div className="w-4 h-4 flex items-center justify-center text-white/80 group-hover/google:text-white transition-colors duration-300">
                      G
                    </div>

                    <span className="text-white/80 group-hover/google:text-white transition-colors text-xs">
                      Sign in with Google
                    </span>

                    {/* Button hover effect */}
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/5 to-white/0"
                      initial={reduced ? false : { x: "-100%" }}
                      whileHover={reduced ? undefined : { x: "100%" }}
                      transition={
                        reduced
                          ? { duration: 0 }
                          : {
                              duration: 1,
                              ease: "easeInOut",
                            }
                      }
                    />
                  </div>
                </motion.button>

                {/* Sign up link */}
                <motion.p
                  className="text-center text-xs text-white/60 mt-4"
                  initial={reduced ? false : { opacity: 0 }}
                  animate={reduced ? { opacity: 1 } : { opacity: 1 }}
                  transition={reduced ? { duration: 0 } : { delay: 0.5 }}
                >
                  Don&apos;t have an account?{" "}
                  <button
                    type="button"
                    onClick={onSignUp}
                    className="relative inline-block group/signup"
                  >
                    <span className="relative z-10 text-white group-hover/signup:text-white/70 transition-colors duration-300 font-medium">
                      Sign up
                    </span>
                    <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-white group-hover/signup:w-full transition-all duration-300" />
                  </button>
                </motion.p>
              </form>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}

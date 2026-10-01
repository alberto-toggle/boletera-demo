import type { ReactNode } from "react";
import { FaCampground, FaFire, FaTint, FaHotTub, FaHiking } from "react-icons/fa";
export interface SelectorOption { title: string; description: string; image: string; icon: ReactNode }
export const selectorOptions: readonly SelectorOption[] = [
    {
      title: "Luxury Tent",
      description: "Cozy glamping under the stars",
      image: "https://cdn.21st.dev/assets/mirror/31/31ee902b46038d690f949a8be82c4b5673d554eac7456974c04950d78b4efe3d.jpg",
      icon: <FaCampground size={24} className="text-white" />
    },
    {
      title: "Campfire Feast",
      description: "Gourmet s'mores & stories",
      image: "https://cdn.21st.dev/assets/mirror/3b/3b6c78ba5a375a240a6452b7c68a889228d52aba6e18e355b77f04472e4e0e76.jpg",
      icon: <FaFire size={24} className="text-white" />
    },
    {
      title: "Lakeside Retreat",
      description: "Private dock & canoe rides",
      image: "https://cdn.21st.dev/assets/mirror/97/97103cb7b8ac5adbbd3e64c7410560b04a83b056daa580ee1b0353f774ec8d3d.jpg",
      icon: <FaTint size={24} className="text-white" />
    },
    {
      title: "Mountain Spa",
      description: "Outdoor sauna & hot tub",
      image: "https://cdn.21st.dev/assets/mirror/9f/9fff1299ab7c6ec1a4b42e57e2ec6853fee03efe144bb054a494ec9c1e145d23.jpg",
      icon: <FaHotTub size={24} className="text-white" />
    },
    {
      title: "Guided Adventure",
      description: "Expert-led nature tours",
      image: "https://cdn.21st.dev/assets/mirror/9f/9f4d6686c3ee21321e110920cfd3b8109d15f61ab2972dfafdeb1f1b1099c568.jpg",
      icon: <FaHiking size={24} className="text-white" />
    }
  ];
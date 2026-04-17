"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

import {
  getOrders,
  getProfile,
  login,
  logout,
  refreshToken,
  signup,
  updateProfile,
} from "@/lib/api";
import { useCartStore } from "@/store/cart-store";
import type { Order, Profile, User } from "@/types/api";

type AuthState = {
  accessToken?: string;
  refreshToken?: string;
  user?: User;
  profile?: Profile;
  orders: Order[];
  loading: boolean;
  error?: string;
  signIn: (payload: { email: string; password: string; sessionId?: string }) => Promise<void>;
  signUp: (payload: {
    email: string;
    password: string;
    fullName?: string;
    sessionId?: string;
  }) => Promise<void>;
  signOut: () => Promise<void>;
  fetchAccount: () => Promise<void>;
  saveProfile: (payload: {
    full_name?: string;
    default_address?: {
      label: string;
      full_name: string;
      line1: string;
      line2?: string;
      city: string;
      state: string;
      postal_code: string;
      country: string;
      phone?: string;
      is_default: boolean;
    };
  }) => Promise<void>;
  refreshSession: () => Promise<void>;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      orders: [],
      loading: false,
      signIn: async ({ email, password, sessionId }) => {
        set({ loading: true, error: undefined });
        try {
          const response = await login({
            email,
            password,
            session_id: sessionId,
          });
          set({
            accessToken: response.access_token,
            refreshToken: response.refresh_token,
            user: response.user,
            loading: false,
          });
          await useCartStore.getState().sync(response.access_token);
          await get().fetchAccount();
        } catch (error) {
          set({
            loading: false,
            error: error instanceof Error ? error.message : "Unable to sign in.",
          });
          throw error;
        }
      },
      signUp: async ({ email, password, fullName, sessionId }) => {
        set({ loading: true, error: undefined });
        try {
          const response = await signup({
            email,
            password,
            full_name: fullName,
            session_id: sessionId,
          });
          set({
            accessToken: response.access_token,
            refreshToken: response.refresh_token,
            user: response.user,
            loading: false,
          });
          await useCartStore.getState().sync(response.access_token);
          await get().fetchAccount();
        } catch (error) {
          set({
            loading: false,
            error: error instanceof Error ? error.message : "Unable to create account.",
          });
          throw error;
        }
      },
      signOut: async () => {
        const refreshTokenValue = get().refreshToken;
        if (refreshTokenValue) {
          await logout(refreshTokenValue).catch(() => undefined);
        }
        set({
          accessToken: undefined,
          refreshToken: undefined,
          user: undefined,
          profile: undefined,
          orders: [],
        });
        await useCartStore.getState().sync(undefined);
      },
      fetchAccount: async () => {
        const accessToken = get().accessToken;
        if (!accessToken) {
          return;
        }
        set({ loading: true, error: undefined });
        try {
          const [profile, orders] = await Promise.all([
            getProfile(accessToken),
            getOrders(accessToken),
          ]);
          set({ profile, orders, loading: false, user: profile });
        } catch (error) {
          set({
            loading: false,
            error: error instanceof Error ? error.message : "Unable to load account.",
          });
        }
      },
      saveProfile: async (payload) => {
        const accessToken = get().accessToken;
        if (!accessToken) {
          throw new Error("You must be signed in.");
        }
        set({ loading: true, error: undefined });
        try {
          const profile = await updateProfile(accessToken, payload);
          set({ profile, user: profile, loading: false });
        } catch (error) {
          set({
            loading: false,
            error: error instanceof Error ? error.message : "Unable to save profile.",
          });
          throw error;
        }
      },
      refreshSession: async () => {
        const refreshTokenValue = get().refreshToken;
        if (!refreshTokenValue) {
          return;
        }
        try {
          const response = await refreshToken(refreshTokenValue);
          set({
            accessToken: response.access_token,
            refreshToken: response.refresh_token,
            user: response.user,
          });
        } catch {
          set({
            accessToken: undefined,
            refreshToken: undefined,
            user: undefined,
            profile: undefined,
            orders: [],
          });
        }
      },
    }),
    {
      name: "heliolabs-auth",
      partialize: (state) => ({
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        user: state.user,
      }),
    }
  )
);


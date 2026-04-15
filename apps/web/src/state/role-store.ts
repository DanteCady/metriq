"use client";

import { create } from "zustand";

import type { Role } from "@metriq/types";

export type RoleState = {
  role: Role;
  setRole: (role: Role) => void;
};

export const useRoleStore = create<RoleState>((set) => ({
  role: "candidate",
  setRole: (role) => set({ role }),
}));


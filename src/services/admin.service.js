import { get, patch } from "./api.js";

export const getOverview  = ()           => get("/admin/overview");
export const getSales     = (days = 30)  => get(`/admin/sales?days=${days}`);
export const getCatalog   = ()           => get("/admin/catalog");
export const getMap       = (days = 30)  => get(`/admin/map?days=${days}`);
export const getProduct   = (days = 30)  => get(`/admin/product?days=${days}`);
export const getPayments  = (days = 30)  => get(`/admin/payments?days=${days}`);
export const getUsers     = (page = 1)   => get(`/admin/users?page=${page}&limit=20`);
export const getUserById  = (id)         => get(`/admin/users/${id}`);
export const updateRole   = (id, role)   => patch(`/admin/users/${id}/role`, { role });
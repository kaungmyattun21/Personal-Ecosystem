import { Request, Response } from "express";
import * as service from "./service.js";

export const addGroceryItem = async (req: Request, res: Response) => {
  const userId = req.user!.id;
  const item = await service.addGroceryItem(userId, req.body);
  res.status(201).json(item);
};

export const addMultipleGroceryItems = async (req: Request, res: Response) => {
  const userId = req.user!.id;
  const result = await service.addMultipleGroceryItems(userId, req.body);
  res.status(201).json(result);
};

export const getGroceryItems = async (req: Request, res: Response) => {
  const userId = req.user!.id;
  const items = await service.getGroceryItems(userId);
  res.json(items);
};

export const getGroceryItem = async (req: Request, res: Response) => {
  const userId = req.user!.id;
  const item = await service.getGroceryItem(String(req.params.id), userId);
  res.json(item);
};

export const updateGroceryItem = async (req: Request, res: Response) => {
  const userId = req.user!.id;
  const item = await service.updateGroceryItem(String(req.params.id), userId, req.body);
  res.json(item);
};

export const removeGroceryItem = async (req: Request, res: Response) => {
  const userId = req.user!.id;
  await service.removeGroceryItem(String(req.params.id), userId);
  res.status(204).send();
};

export const createShoppingList = async (req: Request, res: Response) => {
  const userId = req.user!.id;
  const list = await service.createShoppingList(userId, req.body);
  res.status(201).json(list);
};

export const getShoppingLists = async (req: Request, res: Response) => {
  const userId = req.user!.id;
  const lists = await service.getShoppingLists(userId);
  res.json(lists);
};

export const getShoppingList = async (req: Request, res: Response) => {
  const userId = req.user!.id;
  const list = await service.getShoppingList(String(req.params.id), userId);
  res.json(list);
};

export const updateShoppingList = async (req: Request, res: Response) => {
  const userId = req.user!.id;
  const list = await service.updateShoppingList(String(req.params.id), userId, req.body);
  res.json(list);
};

export const removeShoppingList = async (req: Request, res: Response) => {
  const userId = req.user!.id;
  await service.removeShoppingList(String(req.params.id), userId);
  res.status(204).send();
};

export const createMealPlan = async (req: Request, res: Response) => {
  const userId = req.user!.id;
  const plan = await service.createMealPlan(userId, req.body);
  res.status(201).json(plan);
};

export const getMealPlans = async (req: Request, res: Response) => {
  const userId = req.user!.id;
  const plans = await service.getMealPlans(userId);
  res.json(plans);
};

export const getMealPlan = async (req: Request, res: Response) => {
  const userId = req.user!.id;
  const plan = await service.getMealPlan(String(req.params.id), userId);
  res.json(plan);
};

export const updateMealPlan = async (req: Request, res: Response) => {
  const userId = req.user!.id;
  const plan = await service.updateMealPlan(String(req.params.id), userId, req.body);
  res.json(plan);
};

export const removeMealPlan = async (req: Request, res: Response) => {
  const userId = req.user!.id;
  await service.removeMealPlan(String(req.params.id), userId);
  res.status(204).send();
};

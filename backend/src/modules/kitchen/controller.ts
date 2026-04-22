import { Request, Response } from "express";
import * as service from "./service.js";

export const addGroceryItem = async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id;
    const item = await service.addGroceryItem(userId, req.body);
    res.status(201).json(item);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const addMultipleGroceryItems = async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id;
    const result = await service.addMultipleGroceryItems(userId, req.body);
    res.status(201).json(result);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const getGroceryItems = async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id;
    const items = await service.getGroceryItems(userId);
    res.json(items);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getGroceryItem = async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id;
    const item = await service.getGroceryItem(req.params.id, userId);
    res.json(item);
  } catch (error: any) {
    if (error.message === "Grocery item not found") {
      res.status(404).json({ error: error.message });
    } else {
      res.status(500).json({ error: error.message });
    }
  }
};

export const updateGroceryItem = async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id;
    const item = await service.updateGroceryItem(req.params.id, userId, req.body);
    res.json(item);
  } catch (error: any) {
    if (error.message === "Grocery item not found") {
      res.status(404).json({ error: error.message });
    } else {
      res.status(400).json({ error: error.message });
    }
  }
};

export const removeGroceryItem = async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id;
    await service.removeGroceryItem(req.params.id, userId);
    res.status(204).send();
  } catch (error: any) {
    if (error.message === "Grocery item not found") {
      res.status(404).json({ error: error.message });
    } else {
      res.status(500).json({ error: error.message });
    }
  }
};

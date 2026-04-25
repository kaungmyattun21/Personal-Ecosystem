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
    const item = await service.getGroceryItem(String(req.params.id), userId);
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
    const item = await service.updateGroceryItem(String(req.params.id), userId, req.body);
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
    await service.removeGroceryItem(String(req.params.id), userId);
    res.status(204).send();
  } catch (error: any) {
    if (error.message === "Grocery item not found") {
      res.status(404).json({ error: error.message });
    } else {
      res.status(500).json({ error: error.message });
    }
  }
};

export const createShoppingList = async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id;
    const list = await service.createShoppingList(userId, req.body);
    res.status(201).json(list);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const getShoppingLists = async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id;
    const lists = await service.getShoppingLists(userId);
    res.json(lists);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getShoppingList = async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id;
    const list = await service.getShoppingList(String(req.params.id), userId);
    res.json(list);
  } catch (error: any) {
    if (error.message === "Shopping list not found") {
      res.status(404).json({ error: error.message });
    } else {
      res.status(500).json({ error: error.message });
    }
  }
};

export const updateShoppingList = async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id;
    const list = await service.updateShoppingList(String(req.params.id), userId, req.body);
    res.json(list);
  } catch (error: any) {
    if (error.message === "Shopping list not found") {
      res.status(404).json({ error: error.message });
    } else {
      res.status(400).json({ error: error.message });
    }
  }
};

export const removeShoppingList = async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id;
    await service.removeShoppingList(String(req.params.id), userId);
    res.status(204).send();
  } catch (error: any) {
    if (error.message === "Shopping list not found") {
      res.status(404).json({ error: error.message });
    } else {
      res.status(500).json({ error: error.message });
    }
  }
};

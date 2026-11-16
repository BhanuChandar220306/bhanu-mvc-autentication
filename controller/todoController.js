
import Todo from "../model/todoModel.js";

// CREATE TODO
export const createTodo = async (req, res) => {
    try {
        const { title, description } = req.body;

        const savedTodo = await Todo.create({
            title,
            description,
            user: req.user.id
        });

        res.status(201).json({
            message: "Todo created successfully",
            todo: savedTodo
        });
    } catch (err) {
        res.status(500).json({
            message: "Failed to create todo"
        });
    }
};

// GET ALL TODOS
export const readTodos = async (req, res) => {
    try {
        const { completed } = req.query;

        const filter = { user: req.user.id };

        if (completed !== undefined) {
            filter.completed = completed === "true";
        }

        const todos = await Todo.find(filter);

        res.status(200).json({
            message: "Todos retrieved successfully",
            todos
        });
    } catch (err) {
        res.status(500).json({
            message: "Failed to retrieve todos"
        });
    }
};

// GET TODO BY ID
export const readTodo = async (req, res) => {
    try {
        const { id } = req.params;

        if (!/^[a-fA-F0-9]{24}$/.test(id)) {
            return res.status(400).json({ message: "Invalid Todo ID" });
        }

        const todo = await Todo.findOne({
            _id: id,
            user: req.user.id
        });

        if (!todo) {
            return res.status(404).json({
                message: "Todo not found"
            });
        }

        res.status(200).json({
            message: "Todo retrieved successfully",
            todo
        });
    } catch (err) {
        res.status(500).json({
            message: "Failed to retrieve todo"
        });
    }
};

// UPDATE TODO
export const updateTodo = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, completed } = req.body;

        if (!/^[a-fA-F0-9]{24}$/.test(id)) {
            return res.status(400).json({ message: "Invalid Todo ID" });
        }

        const updatedTodo = await Todo.findOneAndUpdate(
            { _id: id, user: req.user.id },
            { title, description, completed },
            { new: true, runValidators: true }
        );

        if (!updatedTodo) {
            return res.status(404).json({
                message: "Todo not found"
            });
        }

        res.status(200).json({
            message: "Todo updated successfully",
            todo: updatedTodo
        });
    } catch (err) {
        res.status(500).json({
            message: "Failed to update todo"
        });
    }
};

// DELETE TODO
export const deleteTodo = async (req, res) => {
    try {
        const { id } = req.params;

        if (!/^[a-fA-F0-9]{24}$/.test(id)) {
            return res.status(400).json({ message: "Invalid Todo ID" });
        }

        const deletedTodo = await Todo.findOneAndDelete({
            _id: id,
            user: req.user.id
        });

        if (!deletedTodo) {
            return res.status(404).json({
                message: "Todo not found"
            });
        }

        res.status(200).json({
            message: "Todo deleted successfully",
            todo: deletedTodo
        });
    } catch (err) {
        res.status(500).json({
            message: "Failed to delete todo"
        });
    }
};

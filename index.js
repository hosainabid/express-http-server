const express = require("express");
const app = express();
const bodyParser = require("body-parser");

// Middleware
app.use(bodyParser.json());

// Mock database
const users = [];
const questions = [
	{
		questionId: 0,
		title: "Two states",
		description: "Given an array , return the maximum of the array?",
		testCases: [
			{
				input: "[1,2,3,4,5]",
				output: "5",
			},
		],
	},
	{
		questionId: 1,
		title: "Two states",
		description: "Given an array , return the maximum of the array?",
		testCases: [
			{
				input: "[1,2,3,4,5]",
				output: "5",
			},
		],
	},
	{
		questionId: 2,
		title: "Two states",
		description: "Given an array , return the maximum of the array?",
		testCases: [
			{
				input: "[1,2,3,4,5]",
				output: "5",
			},
		],
	},
];
const submissions = [];

// Admin users
const adminUsers = [{ username: "admin", password: "admin" }];

// Authentication middleware
const authenticateUser = (req, res, next) => {
	const { username, password } = req.headers;

	// Check if user is an admin
	const isAdmin = adminUsers.find(
		(user) => user.username === username && user.password === password
	);
	if (!isAdmin) {
		return res.status(401).json({ error: "Unauthorized" });
	}

	next();
};

// Signup route
app.post("/signup", (req, res) => {
	const { username, password } = req.body;

	// Check if user already exists
	const existingUser = users.find((user) => user.username === username);
	if (existingUser) {
		return res.status(409).json({ error: "User already exists" });
	}

	// Create a new user
	const newUser = { username, password };
	users.push(newUser);

	res.status(200).json({ message: "Signup successful" });
});

// Login route
app.post("/login", (req, res) => {
	const { username, password } = req.body;

	// Check if user exists
	const user = users.find((user) => user.username === username);
	if (!user || user.password !== password) {
		return res.status(401).json({ error: "Invalid credentials" });
	}

	res.json({ message: "Login successful" });
});

// Questions route
app.get("/questions", (req, res) => {
	res.json(questions);
});

// Submissions route
app.get("/submissions", (req, res) => {
	res.json(submissions);
});

// Submit a new submission
app.post("/submissions", (req, res) => {
	const { questionId, answer } = req.body;

	// Check if the question exists
	const question = questions.find((q) => q.id === questionId);
	if (!question) {
		return res.status(404).json({ error: "Question not found" });
	}

	// Generate a random boolean value to accept or reject the submission
	const isAccepted = Math.random() < 0.5;

	// Create a new submission with acceptance status
	const newSubmission = { questionId, answer, isAccepted };
	submissions.push(newSubmission);

	res.status(201).json({ message: "Submission created", isAccepted });
});

// Admin route to add new problems
app.post("/admin/problems", authenticateUser, (req, res) => {
	const { problem } = req.body;

	// Add the new problem to the questions array
	questions.push(problem);

	res.status(201).json({ message: "Problem added" });
});

// Start the server
app.listen(3000, () => {
	console.log("Server started on port 3000");
});

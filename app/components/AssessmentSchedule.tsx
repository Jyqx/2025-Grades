"use client";

import { useState, useEffect } from "react";

interface Assessment {
	id: number;
	name: string;
	weight: number;
	dueDate: string;
	time: string;
	description?: string;
}

interface AssessmentScheduleProps {
	assessments: Assessment[];
	className: string;
}

export default function AssessmentSchedule({
	assessments,
	className,
}: AssessmentScheduleProps) {
	// State to store grades for each assignment
	const [grades, setGrades] = useState<{ [id: number]: number | null }>({});

	// State to track expanded assignment
	const [expandedId, setExpandedId] = useState<number | null>(null);

	// Reset grades when the assessments change (i.e., when the active tab changes)
	useEffect(() => {
		setGrades({});
	}, []);

	// Function to update grades for an assignment
	const handleGradeChange = (id: number, value: number | null) => {
		setGrades((prev) => ({ ...prev, [id]: value }));
	};

	// Calculate the overall weighted grade based on the input grades
	const totalWeightedGrade = assessments.reduce((acc, assessment) => {
		const grade = grades[assessment.id];
		return grade !== null && grade !== undefined
			? acc + (grade * assessment.weight) / 100
			: acc;
	}, 0);

	return (
		<div className="w-full max-w-3xl mx-auto my-8 bg-white rounded-lg shadow-lg">
			{/* Class Name and Overall Weighted Grade */}
			<div className="p-6 border-b flex flex-col justify-between items-center">
				<h2 className="text-2xl font-bold text-gray-700">{className}</h2>
				<div className="text-gray-700 font-medium mt-2">
					Overall Weighted Grade:{" "}
					<span className="text-blue-600 font-bold">
						{totalWeightedGrade.toFixed(2)}%
					</span>
				</div>
				{/* Overall Weighted Grade Progress Bar */}
				<div className="w-full bg-gray-200 rounded-full h-4 mt-2">
					<div
						className="bg-blue-600 h-4 rounded-full"
						style={{ width: `${totalWeightedGrade}%` }}
					/>
				</div>
			</div>

			{/* Assessment List */}
			<div className="p-6">
				<div className="space-y-6">
					{assessments.map((assessment) => (
						<div
							key={assessment.id}
							className="relative p-4 border rounded-lg hover:shadow-md transition-shadow duration-200"
						>
							<div className="flex items-center justify-between">
								<div className="flex-1">
									<h3 className="font-semibold text-lg text-gray-600">
										{assessment.id}. {assessment.name}
									</h3>
									<div className="mt-1 text-sm text-gray-600">
										Due: {assessment.dueDate} at {assessment.time}
									</div>
								</div>
								<div className="text-2xl font-bold text-blue-600">
									{assessment.weight}%
								</div>
							</div>

							{/* Grade Input for Each Assignment */}
							<div className="mt-2">
								<label className="text-gray-600 font-medium mr-2">
									Current Grade: {grades[assessment.id] || 0}%
								</label>
								<input
									type="range"
									value={grades[assessment.id] || 0}
									onChange={(e) =>
										handleGradeChange(
											assessment.id,
											e.target.value ? Number(e.target.value) : null,
										)
									}
									className="w-full"
									min="0"
									max="100"
								/>
								<input
									type="number"
									value={grades[assessment.id] || 0}
									onChange={(e) =>
										handleGradeChange(
											assessment.id,
											e.target.value ? Number(e.target.value) : null,
										)
									}
									className="border rounded-lg px-2 py-1 text-gray-700 w-20 mt-2"
									placeholder="0-100"
									min="0"
									max="100"
								/>
							</div>

							{/* Dropdown Toggle */}
							<button
								type="button"
								onClick={() =>
									setExpandedId(
										expandedId === assessment.id ? null : assessment.id,
									)
								}
								className="mt-2 text-blue-600 hover:underline text-sm"
							>
								{expandedId === assessment.id ? "Hide Details" : "Show Details"}
							</button>

							{/* Extra Information */}
							{expandedId === assessment.id && (
								<div className="mt-4 p-4 bg-gray-50 border rounded-lg">
									<p className="text-gray-700">
										{assessment.description ||
											"No additional information available."}
									</p>
								</div>
							)}
						</div>
					))}
				</div>
			</div>
		</div>
	);
}

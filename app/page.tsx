"use client";

import { useState } from "react";
import AssessmentSchedule from "./components/AssessmentSchedule";
import assessments from "../data/assessments.json"; // Import the JSON

// Type for each assessment item
interface Assessment {
	id: number;
	name: string;
	weight: number;
	dueDate: string;
	time: string;
}

// Type for the assessments object
type AssessmentData = {
	[key in "DISC301" | "PROD323" | "PROD321" | "SENG201" | "PROD225"]: Assessment[];
};

// Type the imported JSON data
const typedAssessments: AssessmentData = assessments;

const tabs: Array<keyof AssessmentData> = [
	"DISC301",
	"PROD323",
	"PROD321",
	"SENG201",
	"PROD225",
];

function getNextAssessment(assessments: Assessment[]) {
	const today = new Date();
	const currentYear = today.getFullYear();
	const upcomingAssessments = assessments.filter((assessment) => {
		const dueDate = new Date(`${assessment.dueDate} ${currentYear}`);
		return dueDate >= today;
	});
	console.log("Upcoming Assessments:", upcomingAssessments);
	return upcomingAssessments.sort(
		(a, b) =>
			new Date(`${a.dueDate} ${currentYear}`).getTime() -
			new Date(`${b.dueDate} ${currentYear}`).getTime(),
	)[0];
}

export default function TabNavigator() {
	const [activeTab, setActiveTab] = useState<keyof AssessmentData>("DISC301");
	const today = new Date().toLocaleDateString("en-US", {
		day: "numeric",
		month: "long",
	});

	return (
		<div className="flex w-full max-w-4xl mx-auto mt-8">
			{/* Sidebar */}
			<div className="w-1/4 p-4 border-r">
				{/* Current Date */}
				<div className="text-left text-gray-600 mb-4 text-xl font-bold">
					{today}
				</div>

				{/* Next Assessments */}
				<div className="mb-4">
					{tabs.map((tab) => {
						const nextAssessment = getNextAssessment(typedAssessments[tab]);
						return (
							<div key={tab} className="text-blue-600 mb-4">
								<div className="font-bold">{tab}:</div>
								<div className="text-md text-gray-600">
									{nextAssessment
										? `${nextAssessment.name} due in ${Math.ceil(
												(new Date(
													`${nextAssessment.dueDate} ${new Date().getFullYear()}`,
												).getTime() -
													new Date().getTime()) /
													(1000 * 60 * 60 * 24),
											)} days`
										: "No upcoming assessments"}
								</div>
								<hr className="my-2" />
							</div>
						);
					})}
				</div>
			</div>

			{/* Main Content */}
			<div className="flex-grow p-4 flex justify-center">
				<div className="w-full max-w-2xl">
					{/* Tab Navigation */}
					<div className="flex border-b mb-4">
						{tabs.map((tab) => (
							<button
								key={tab}
								type="button"
								onClick={() => setActiveTab(tab)}
								className={`p-2 flex-1 text-center font-semibold ${
									activeTab === tab
										? "border-b-2 border-blue-500 text-blue-600"
										: "text-gray-600"
								}`}
							>
								{tab}
							</button>
						))}
					</div>

					{/* Tab Content */}
					<div>
						{typedAssessments[activeTab].length > 0 ? (
							<AssessmentSchedule
								key={activeTab} // Pass the activeTab as the key
								assessments={typedAssessments[activeTab]}
								className={activeTab}
							/>
						) : (
							<div className="p-6 text-gray-500">
								No assessments available yet.
							</div>
						)}
					</div>
				</div>
			</div>
		</div>
	);
}

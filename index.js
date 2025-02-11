// // The provided course information.
// const course = {
//     id: 451,
//     name: "Introduction to JavaScript"
//   };
  
//   // The provided assignment group.
//   const group = {
//     id: 12345,
//     name: "Fundamentals of JavaScript",
//     course_id: 451,
//     group_weight: 25,
//     assignments: [
//       {
//         id: 1,
//         name: "Declare a Variable",
//         due_at: "2023-01-25",
//         points_possible: 50
//       },
//       {
//         id: 2,
//         name: "Write a Function",
//         due_at: "2023-02-27",
//         points_possible: 150
//       },
//       {
//         id: 3,
//         name: "Code the World",
//         due_at: "3156-11-15",
//         points_possible: 0
//       }
//     ]
//   };
  
//   // The provided learner submission data.
//   const submissions = [
//     {
//       learner_id: 125,
//       assignment_id: 1,
//       submission: {
//         submitted_at: "2023-01-25",
//         score: 47
//       }
//     },
//     {
//       learner_id: 125,
//       assignment_id: 2,
//       submission: {
//         submitted_at: "2023-02-12",
//         score: 150
//       }
//     },
//     {
//       learner_id: 125,
//       assignment_id: 3,
//       submission: {
//         submitted_at: "2023-01-25",
//         score: 400
//       }
//     },
//     {
//       learner_id: 132,
//       assignment_id: 1,
//       submission: {
//         submitted_at: "2023-01-24",
//         score: 39
//       }
//     },
//     {
//       learner_id: 132,
//       assignment_id: 2,
//       submission: {
//         submitted_at: "2023-03-07",
//         score: 140
//       }
//     }
//   ];

// * Validate Input Data
const validateData = (course, group) => {
  if (group.course_id !== course.id) {
      throw new Error(`Invalid data: AssignmentGroup ${group.id} does not belong to Course ${course.id}`)
  }

  group.assignments.forEach(assignment => {
      if (assignment.points_possible === 0) {
          throw new Error(`Invalid data: Assignment ${assignment.id} has zero possible points.`)
      }
  })
}

// ! validateData(CourseInfo, AssignmentGroup)

// * Filter Valid Assignments
const filterValidAssignments = (assignments) => {
  const now = new Date()
  return assignments.filter(assignment => new Date(assignment.due_at) < now)
}

// console.log(filterValidAssignments(AssignmentGroup))

// * Process Learner Submissions
const calculateAssignmentScores = (submissions, assignments) => {
const scores = {}

assignments.forEach(assignment => {
    const submission = submissions.find(sub => sub.assignment_id === assignment.id)
    
    if (submission) {
        let score = submission.submission.score
        if (new Date(submission.submission.submitted_at) > new Date(assignment.due_at)) {
            score -= assignment.points_possible * 0.1 
       }
     scores[assignment.id] = (score / assignment.points_possible) * 100
    }
    
})
return scores
}

// * Calculate Weighted Average

const calculateWeightedAverage = (scores, assignments) => {
let totalPoints = 0
let weightedScore = 0

assignments.forEach(assignment => {
  if (scores[assignment.id] !== undefined) {
    totalPoints += assignment.points_possible
    weightedScore += (scores[assignment.id] / 100) * assignment.points_possible
  }
})

return (weightedScore / totalPoints) * 100
}

// * Main Function: getLearnerData()
const getLearnerData = (course, group, submissions) => {
// Step 1: Validate input data
try {
  validateData(course, group)

// Step 2: Filter assignments that are due
const validAssignments = filterValidAssignments(group.assignments)

// Step 3: Process each learner's submissions
const learners = {}
submissions.forEach(submission => {
  if (!learners[submission.learner_id]) {
    learners[submission.learner_id] = { 
      id: submission.learner_id, 
      scores: {}
    }
    learners[submission.learner_id].scores = calculateAssignmentScores(
      submissions.filter(sub => sub.learner_id === submission.learner_id), validAssignments
    )
  }
})
// Step 4: Calculate weighted averages and format results
const results = Object.values(learners).map(learner => {
  const learnerScores = learner.scores
  const average = calculateWeightedAverage(learnerScores, validAssignments)

  return {
    id: learner.id,
    avg: average,
    ...learnerScores
  }
})

  return results
} 
catch (error) {
  console.error(`Error processing data: ${error.message}`)
  return []
}
}

const course = { id: 1, name: "Math 101" };
const group = {
id: 1,
name: "Homework",
course_id: 1,
group_weight: 20,
assignments: [
  { id: 1, name: "Assignment 1", due_at: "2025-01-01", points_possible: 100 },
  { id: 2, name: "Assignment 2", due_at: "2025-02-01", points_possible: 50 }
]
};
const submissions = [
{ learner_id: 1, assignment_id: 1, submission: { submitted_at: "2025-01-02", score: 90 } },
{ learner_id: 1, assignment_id: 2, submission: { submitted_at: "2025-01-31", score: 40 } }
];

// ! I'm unable to find why the function returns the value in the wrong order and why the avg is incorrect
console.log(getLearnerData(course, group, submissions));
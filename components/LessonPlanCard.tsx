import Link from 'next/link'
import { LessonPlan } from '../types/database'

interface LessonPlanCardProps {
  lessonPlan: LessonPlan
  onDelete: (id: string) => void
}

export default function LessonPlanCard({ lessonPlan, onDelete }: LessonPlanCardProps) {
  return (
    <div className="card">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xl font-bold text-gray-900">
            {lessonPlan.title}
          </h3>
          <div className="text-gray-600 space-y-1">
            <p>{lessonPlan.subject} • Grade {lessonPlan.grade_level}</p>
            <p>Duration: {lessonPlan.duration} minutes</p>
          </div>
        </div>
        <div className="flex space-x-2">
          <Link
            href={`/classrooms/${lessonPlan.classroom_id}/lesson-plans/${lessonPlan.id}`}
            className="btn-secondary text-sm"
          >
            View
          </Link>
          <button
            onClick={() => onDelete(lessonPlan.id)}
            className="px-3 py-1 text-sm text-red-600 hover:text-red-800 transition-colors"
          >
            Delete
          </button>
        </div>
      </div>

      <div className="mb-4">
        <h4 className="font-semibold text-gray-700 mb-2">Objectives:</h4>
        <ul className="list-disc list-inside text-gray-600 text-sm">
          {lessonPlan.objectives.map((objective, index) => (
            <li key={index}>{objective}</li>
          ))}
        </ul>
      </div>

      {lessonPlan.materials && lessonPlan.materials.length > 0 && (
        <div className="mb-4">
          <h4 className="font-semibold text-gray-700 mb-2">Materials:</h4>
          <ul className="list-disc list-inside text-gray-600 text-sm">
            {lessonPlan.materials.map((material, index) => (
              <li key={index}>{material}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="text-sm text-gray-600">
        <p className="line-clamp-3">{lessonPlan.procedure}</p>
      </div>
    </div>
  )
}

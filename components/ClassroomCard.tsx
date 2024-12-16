import Link from 'next/link'
import { Classroom } from '../types/database'

interface ClassroomCardProps {
  classroom: Classroom
  onDelete: (id: string) => void
}

export default function ClassroomCard({ classroom, onDelete }: ClassroomCardProps) {
  return (
    <div className="card">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xl font-bold text-gray-900">{classroom.name}</h3>
          <p className="text-gray-600">
            {classroom.grade_level} • {classroom.subject}
          </p>
        </div>
        <div className="flex space-x-2">
          <Link
            href={`/classrooms/${classroom.id}`}
            className="btn-secondary text-sm"
          >
            View
          </Link>
          <button
            onClick={() => onDelete(classroom.id)}
            className="px-3 py-1 text-sm text-red-600 hover:text-red-800 transition-colors"
          >
            Delete
          </button>
        </div>
      </div>
      
      {classroom.description && (
        <p className="text-gray-600 mb-4">{classroom.description}</p>
      )}

      <div className="flex flex-wrap gap-2">
        <span className="px-2 py-1 bg-primary/10 text-primary rounded text-sm">
          {classroom.academic_year}
        </span>
      </div>
    </div>
  )
}

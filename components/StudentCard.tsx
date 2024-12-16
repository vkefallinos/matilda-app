import Link from 'next/link'
import { Student } from '../types/database'

interface StudentCardProps {
  student: Student
  onDelete: (id: string) => void
}

export default function StudentCard({ student, onDelete }: StudentCardProps) {
  return (
    <div className="card">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xl font-bold text-gray-900">
            {student.first_name} {student.last_name}
          </h3>
          {student.date_of_birth && (
            <p className="text-gray-600">
              Born: {new Date(student.date_of_birth).toLocaleDateString()}
            </p>
          )}
        </div>
        <div className="flex space-x-2">
          <Link
            href={`/students/${student.id}`}
            className="btn-secondary text-sm"
          >
            View
          </Link>
          <button
            onClick={() => onDelete(student.id)}
            className="px-3 py-1 text-sm text-red-600 hover:text-red-800 transition-colors"
          >
            Delete
          </button>
        </div>
      </div>

      {student.special_needs && (
        <div className="mb-4">
          <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded text-sm">
            Special Needs
          </span>
        </div>
      )}

      {student.notes && (
        <p className="text-gray-600 text-sm">{student.notes}</p>
      )}
    </div>
  )
}

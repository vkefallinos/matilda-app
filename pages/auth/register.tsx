import Layout from '../../components/Layout'
import RegisterForm from '../../components/RegisterForm'

export default function Register() {
  return (
    <Layout>
      <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h2 className="text-4xl font-bold text-primary">Matilda</h2>
            <p className="mt-2 text-gray-600">Create Your Teacher Account</p>
          </div>
          <RegisterForm />
        </div>
      </div>
    </Layout>
  )
}

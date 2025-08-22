import React, { useState, useEffect } from 'react'
import { 
  Plus, 
  Edit, 
  Trash2, 
  Search,
  Users,
  UserCheck,
  Mail,
  Phone,
  Save,
  X
} from 'lucide-react'
import { empleadosAPI } from '../services/api'
import { useAuth } from '../contexts/AuthContext'
import { Navigate, useNavigate } from 'react-router-dom'

interface Employee {
  id_empleado: number
  cuil: string
  nombre: string
  apellido: string
  domicilio: string
  telefono: string
  mail: string
  sueldo?: number
  puesto?: string
  estado?: string
}

interface EmployeeFormData {
  cuil: string
  nombre: string
  apellido: string
  domicilio: string
  telefono: string
  mail: string
  sueldo: string
  puesto: string
  estado: string
}

const Empleados: React.FC = () => {
  const { isAdmin } = useAuth()
  const navigate = useNavigate()
  const [searchTerm, setSearchTerm] = useState('')
  const [showAddModal, setShowAddModal] = useState(false)
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null)
  const [employees, setEmployees] = useState<Employee[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // Form data
  const [formData, setFormData] = useState<EmployeeFormData>({
    cuil: '',
    nombre: '',
    apellido: '',
    domicilio: '',
    telefono: '',
    mail: '',
    sueldo: '',
    puesto: '',
    estado: 'Activo'
  })

  // Redirect if not admin
  if (!isAdmin) {
    return <Navigate to="/" replace />
  }

  useEffect(() => {
    loadEmployees()
  }, [])

  const loadEmployees = async () => {
    try {
      setLoading(true)
      const response = await empleadosAPI.getAll()
      setEmployees(response.data)
    } catch (err: any) {
      setError('Error al cargar empleados: ' + (err.response?.data?.error || err.message))
      // Fallback to mock data for development
      setEmployees([
        { id_empleado: 1, cuil: '20123456789', nombre: 'Ana', apellido: 'García', domicilio: 'Calle 123', telefono: '+1234567890', mail: 'ana@empresa.com', sueldo: 4500, puesto: 'Gerente', estado: 'Activo' },
        { id_empleado: 2, cuil: '20123456790', nombre: 'Carlos', apellido: 'López', domicilio: 'Av. Principal 456', telefono: '+1234567891', mail: 'carlos@empresa.com', sueldo: 2800, puesto: 'Vendedor', estado: 'Activo' },
      ])
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const employeeData = {
        ...formData,
        sueldo: parseFloat(formData.sueldo) || 0
      }

      if (editingEmployee) {
        await empleadosAPI.update(editingEmployee.id_empleado, employeeData)
        setEditingEmployee(null)
      } else {
        await empleadosAPI.create(employeeData)
      }

      setShowAddModal(false)
      resetForm()
      loadEmployees()
    } catch (err: any) {
      setError('Error al guardar empleado: ' + (err.response?.data?.error || err.message))
    }
  }

  const handleEdit = (employee: Employee) => {
    setEditingEmployee(employee)
    setFormData({
      cuil: employee.cuil,
      nombre: employee.nombre,
      apellido: employee.apellido,
      domicilio: employee.domicilio,
      telefono: employee.telefono,
      mail: employee.mail,
      sueldo: employee.sueldo?.toString() || '',
      puesto: employee.puesto || '',
      estado: employee.estado || 'Activo'
    })
    setShowAddModal(true)
  }

  const handleDelete = async (id: number) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este empleado?')) {
      try {
        await empleadosAPI.delete(id)
        loadEmployees()
      } catch (err: any) {
        setError('Error al eliminar empleado: ' + (err.response?.data?.error || err.message))
      }
    }
  }

  const resetForm = () => {
    setFormData({
      cuil: '',
      nombre: '',
      apellido: '',
      domicilio: '',
      telefono: '',
      mail: '',
      sueldo: '',
      puesto: '',
      estado: 'Activo'
    })
    setEditingEmployee(null)
  }

  const handleNuevoEmpleado = () => {
    navigate('/empleados/nuevo')
  }

  const filteredEmployees = employees.filter(employee =>
    employee.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    employee.apellido.toLowerCase().includes(searchTerm.toLowerCase()) ||
    employee.mail.toLowerCase().includes(searchTerm.toLowerCase()) ||
    employee.puesto?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const stats = [
    { name: 'Total Empleados', value: employees.length, icon: Users, color: 'text-blue-600' },
    { name: 'Empleados Activos', value: employees.filter(e => e.estado === 'Activo').length, icon: UserCheck, color: 'text-green-600' },
    { name: 'Salario Promedio', value: `$${employees.length > 0 ? (employees.reduce((sum, e) => sum + (e.sueldo || 0), 0) / employees.length).toFixed(0) : 0}`, icon: Mail, color: 'text-purple-600' },
  ]

  const departments = [...new Set(employees.map(e => e.puesto).filter(Boolean))]
  const positions = [...new Set(employees.map(e => e.puesto).filter(Boolean))]

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestión de Empleados</h1>
          <p className="text-gray-600">Administra el personal de la empresa (Solo Administradores)</p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={handleNuevoEmpleado}
            className="btn-primary"
          >
            <Plus className="h-4 w-4 mr-2" />
            Nuevo Empleado
          </button>
          <button
            onClick={() => {
              resetForm()
              setShowAddModal(true)
            }}
            className="btn-secondary"
          >
            <Plus className="h-4 w-4 mr-2" />
            Agregar (Modal)
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
          <button onClick={() => setError('')} className="float-right">
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
        {stats.map((stat) => (
          <div key={stat.name} className="card">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <stat.icon className={`h-8 w-8 ${stat.color}`} />
              </div>
              <div className="ml-4 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    {stat.name}
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {stat.value}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Search and Filters */}
      <div className="card">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Buscar empleados..."
                className="input-field pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Employees Table */}
      <div className="card">
        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
            <p className="mt-2 text-gray-600">Cargando empleados...</p>
          </div>
        ) : (
          <div className="overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Empleado
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    CUIL
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contacto
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Posición
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Salario
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredEmployees.map((employee) => (
                  <tr key={employee.id_empleado} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {employee.nombre} {employee.apellido}
                        </div>
                        <div className="text-sm text-gray-500">
                          ID: {employee.id_empleado}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {employee.cuil}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="flex items-center text-sm text-gray-900">
                          <Mail className="h-4 w-4 mr-1" />
                          {employee.mail}
                        </div>
                        <div className="flex items-center text-sm text-gray-500">
                          <Phone className="h-4 w-4 mr-1" />
                          {employee.telefono}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {employee.puesto || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        employee.estado === 'Activo' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {employee.estado || 'N/A'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      ${employee.sueldo?.toFixed(2) || '0.00'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEdit(employee)}
                          className="text-primary-600 hover:text-primary-900"
                          title="Editar"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(employee.id_empleado)}
                          className="text-red-600 hover:text-red-900"
                          title="Eliminar"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Department Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Empleados por Departamento</h3>
          <div className="space-y-3">
            {departments.map(dept => (
              <div key={dept} className="flex justify-between items-center">
                <span className="text-sm text-gray-600">{dept}</span>
                <span className="text-sm font-medium text-gray-900">
                  {employees.filter(e => e.puesto === dept).length}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Empleados por Posición</h3>
          <div className="space-y-3">
            {positions.map(pos => (
              <div key={pos} className="flex justify-between items-center">
                <span className="text-sm text-gray-600">{pos}</span>
                <span className="text-sm font-medium text-gray-900">
                  {employees.filter(e => e.puesto === pos).length}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Add/Edit Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-full max-w-2xl shadow-lg rounded-md bg-white">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">
                {editingEmployee ? 'Editar Empleado' : 'Nuevo Empleado'}
              </h3>
              <button
                onClick={() => {
                  setShowAddModal(false)
                  resetForm()
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">CUIL</label>
                  <input
                    type="text"
                    required
                    className="input-field"
                    value={formData.cuil}
                    onChange={(e) => setFormData({...formData, cuil: e.target.value})}
                    maxLength={11}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
                  <input
                    type="text"
                    required
                    className="input-field"
                    value={formData.nombre}
                    onChange={(e) => setFormData({...formData, nombre: e.target.value})}
                    maxLength={25}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Apellido</label>
                  <input
                    type="text"
                    required
                    className="input-field"
                    value={formData.apellido}
                    onChange={(e) => setFormData({...formData, apellido: e.target.value})}
                    maxLength={30}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Domicilio</label>
                  <input
                    type="text"
                    required
                    className="input-field"
                    value={formData.domicilio}
                    onChange={(e) => setFormData({...formData, domicilio: e.target.value})}
                    maxLength={35}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
                  <input
                    type="text"
                    required
                    className="input-field"
                    value={formData.telefono}
                    onChange={(e) => setFormData({...formData, telefono: e.target.value})}
                    maxLength={13}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    required
                    className="input-field"
                    value={formData.mail}
                    onChange={(e) => setFormData({...formData, mail: e.target.value})}
                    maxLength={45}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Sueldo</label>
                  <input
                    type="number"
                    step="0.01"
                    className="input-field"
                    value={formData.sueldo}
                    onChange={(e) => setFormData({...formData, sueldo: e.target.value})}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Puesto</label>
                  <input
                    type="text"
                    className="input-field"
                    value={formData.puesto}
                    onChange={(e) => setFormData({...formData, puesto: e.target.value})}
                    maxLength={20}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
                  <select
                    className="input-field"
                    value={formData.estado}
                    onChange={(e) => setFormData({...formData, estado: e.target.value})}
                  >
                    <option value="Activo">Activo</option>
                    <option value="Inactivo">Inactivo</option>
                    <option value="Vacaciones">Vacaciones</option>
                    <option value="Licencia">Licencia</option>
                  </select>
                </div>
              </div>
              
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddModal(false)
                    resetForm()
                  }}
                  className="btn-secondary"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="btn-primary"
                >
                  <Save className="h-4 w-4 mr-2 inline" />
                  {editingEmployee ? 'Actualizar' : 'Crear'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default Empleados

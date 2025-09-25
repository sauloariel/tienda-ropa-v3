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
  X,
  AlertCircle,
  CheckCircle,
  Key,
  UserPlus
} from 'lucide-react'
import { empleadosAPI } from '../services/api'
import { rolesAPI, type Rol } from '../services/roles'
import { loguinAPI, type LoguinUser } from '../services/loguin'
import { useSimpleAuth } from '../contexts/SimpleAuthContext'
import { Navigate } from 'react-router-dom'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'


interface Employee {
  id_empleado: number
  cuil: string
  nombre: string
  apellido: string
  domicilio: string
  telefono: string
  mail: string
  sueldo?: number
  rol?: string
  id_rol?: number
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
  rol: string
  id_rol?: number
  estado: string
}

interface LoginUserFormData {
  usuario: string
  password: string
  id_rol: number | undefined
}

const Empleados: React.FC = () => {
  const { user } = useSimpleAuth()
  const isAdmin = user?.rol === 'Admin'
  const [searchTerm, setSearchTerm] = useState('')
  const [showAddModal, setShowAddModal] = useState(false)
  const [showLoginModal, setShowLoginModal] = useState(false)
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null)
  const [selectedEmployeeForLogin, setSelectedEmployeeForLogin] = useState<Employee | null>(null)
  const [employees, setEmployees] = useState<Employee[]>([])
  const [roles, setRoles] = useState<Rol[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isCreatingLogin, setIsCreatingLogin] = useState(false)

  // Form data
  const [formData, setFormData] = useState<EmployeeFormData>({
    cuil: '',
    nombre: '',
    apellido: '',
    domicilio: '',
    telefono: '',
    mail: '',
    sueldo: '',
    rol: '',
    estado: 'activo'
  })

  const [loginFormData, setLoginFormData] = useState<LoginUserFormData>({
    usuario: '',
    password: '',
    id_rol: undefined
  })

  // Redirect if not admin
  if (!isAdmin) {
    return <Navigate to="/" replace />
  }

  useEffect(() => {
    loadEmployees()
    loadRoles()
  }, [])

  const loadEmployees = async () => {
    try {
      setLoading(true)
      setError('')
      console.log('🔄 Cargando empleados desde la base de datos...')
      const response = await empleadosAPI.getAll()
      console.log('✅ Empleados cargados:', response.data)
      setEmployees(response.data)
    } catch (err: any) {
      console.error('❌ Error al cargar empleados:', err)
      const errorMsg = err.response?.data?.error || err.message || 'Error desconocido'
      setError(`Error al cargar empleados: ${errorMsg}`)
      
      // Fallback to mock data for development
      setEmployees([
        { id_empleado: 1, cuil: '20123456789', nombre: 'Ana', apellido: 'García', domicilio: 'Calle 123', telefono: '+1234567890', mail: 'ana@empresa.com', sueldo: 4500, rol: 'Admin', estado: 'activo' },
        { id_empleado: 2, cuil: '20123456790', nombre: 'Carlos', apellido: 'López', domicilio: 'Av. Principal 456', telefono: '+1234567891', mail: 'carlos@empresa.com', sueldo: 2800, rol: 'Vendedor', estado: 'activo' },
      ])
      toast.warning('Usando datos de ejemplo - Backend no disponible')
    } finally {
      setLoading(false)
    }
  }

  const loadRoles = async () => {
    try {
      console.log('🔄 Cargando roles desde la base de datos...')
      const response = await rolesAPI.getAll()
      console.log('✅ Roles cargados:', response.data)
      setRoles(response.data)
    } catch (err: any) {
      console.error('❌ Error al cargar roles:', err)
      // No mostramos error para roles ya que no es crítico
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
      rol: '',
      id_rol: undefined,
      estado: 'activo'
    })
    setEditingEmployee(null)
  }

  const resetLoginForm = () => {
    setLoginFormData({
      usuario: '',
      password: '',
      id_rol: undefined
    })
    setSelectedEmployeeForLogin(null)
  }

  const handleLoginInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    
    setLoginFormData(prev => ({
      ...prev,
      [name]: name === 'id_rol' ? (value ? parseInt(value) : undefined) : value
    }))
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    
    if (name === 'id_rol') {
      const selectedRol = roles.find(rol => rol.id_rol === parseInt(value))
      setFormData(prev => ({
        ...prev,
        id_rol: value ? parseInt(value) : undefined,
        rol: selectedRol?.descripcion || ''
      }))
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }))
    }
  }

  const validateForm = (): boolean => {
    if (!formData.cuil || formData.cuil.length !== 11) {
      toast.error('CUIL debe tener exactamente 11 dígitos')
      return false
    }
    if (!formData.nombre.trim()) {
      toast.error('Nombre es requerido')
      return false
    }
    if (!formData.apellido.trim()) {
      toast.error('Apellido es requerido')
      return false
    }
    if (!formData.domicilio.trim()) {
      toast.error('Domicilio es requerido')
      return false
    }
    if (!formData.telefono.trim()) {
      toast.error('Teléfono es requerido')
      return false
    }
    if (!formData.mail.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.mail)) {
      toast.error('Email válido es requerido')
      return false
    }
    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return
    
    try {
      setIsSubmitting(true)
      
      const employeeData = {
        ...formData,
        cuil: formData.cuil.replace(/\D+/g, ''),
        telefono: formData.telefono.replace(/[^0-9()+\- ]+/g, '').trim(),
        sueldo: formData.sueldo ? parseFloat(formData.sueldo) : undefined,
        nombre: formData.nombre.trim(),
        apellido: formData.apellido.trim(),
        domicilio: formData.domicilio.trim(),
        mail: formData.mail.trim(),
        puesto: formData.puesto?.trim() || undefined,
        estado: formData.estado || undefined,
        id_rol: formData.id_rol
      }

      if (editingEmployee) {
        console.log('🔄 Actualizando empleado:', editingEmployee.id_empleado)
        await empleadosAPI.update(editingEmployee.id_empleado, employeeData)
        toast.success('Empleado actualizado exitosamente')
      } else {
        console.log('🔄 Creando nuevo empleado')
        await empleadosAPI.create(employeeData)
        toast.success('Empleado creado exitosamente')
      }

      setShowAddModal(false)
      resetForm()
      loadEmployees()
    } catch (err: any) {
      console.error('❌ Error al guardar empleado:', err)
      const errorMsg = err.response?.data?.error || err.message || 'Error desconocido'
      toast.error(`Error al guardar empleado: ${errorMsg}`)
    } finally {
      setIsSubmitting(false)
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
      rol: employee.rol || '',
      id_rol: employee.id_rol || undefined,
      estado: employee.estado || 'activo'
    })
    setShowAddModal(true)
  }

  const handleDelete = async (id: number) => {
    if (!window.confirm('¿Estás seguro de que quieres eliminar este empleado?')) {
      return
    }

    try {
      console.log('🗑️ Eliminando empleado:', id)
      await empleadosAPI.delete(id)
      toast.success('Empleado eliminado exitosamente')
      loadEmployees()
    } catch (err: any) {
      console.error('❌ Error al eliminar empleado:', err)
      const errorMsg = err.response?.data?.error || err.message || 'Error desconocido'
      toast.error(`Error al eliminar empleado: ${errorMsg}`)
    }
  }

  const handleCreateLogin = (employee: Employee) => {
    setSelectedEmployeeForLogin(employee)
    setLoginFormData({
      usuario: '',
      password: '',
      id_rol: employee.id_rol || undefined
    })
    setShowLoginModal(true)
  }

  const validateLoginForm = (): boolean => {
    if (!loginFormData.usuario.trim()) {
      toast.error('Usuario es requerido')
      return false
    }
    if (!loginFormData.password.trim()) {
      toast.error('Contraseña es requerida')
      return false
    }
    if (!loginFormData.id_rol) {
      toast.error('Rol es requerido')
      return false
    }
    return true
  }

  const handleCreateLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateLoginForm() || !selectedEmployeeForLogin) return
    
    try {
      setIsCreatingLogin(true)
      
      const loginData = {
        usuario: loginFormData.usuario.trim(),
        password: loginFormData.password,
        id_empleado: selectedEmployeeForLogin.id_empleado,
        id_rol: loginFormData.id_rol!
      }

      console.log('🔄 Creando usuario de login para empleado:', selectedEmployeeForLogin.id_empleado)
      await loguinAPI.create(loginData)
      toast.success('Usuario de login creado exitosamente')
      
      setShowLoginModal(false)
      resetLoginForm()
      loadEmployees() // Recargar empleados para mostrar el nuevo usuario
    } catch (err: any) {
      console.error('❌ Error al crear usuario de login:', err)
      const errorMsg = err.response?.data?.error || err.message || 'Error desconocido'
      toast.error(`Error al crear usuario de login: ${errorMsg}`)
    } finally {
      setIsCreatingLogin(false)
    }
  }

  const filteredEmployees = employees.filter(employee =>
    employee.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    employee.apellido.toLowerCase().includes(searchTerm.toLowerCase()) ||
    employee.cuil.includes(searchTerm) ||
    employee.mail.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getStatusColor = (estado: string) => {
    switch (estado?.toLowerCase()) {
      case 'activo': return 'text-green-600 bg-green-100'
      case 'inactivo': return 'text-yellow-600 bg-yellow-100'
      case 'baja': return 'text-red-600 bg-red-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getStatusIcon = (estado: string) => {
    switch (estado?.toLowerCase()) {
      case 'activo': return <CheckCircle className="h-4 w-4" />
      case 'inactivo': return <AlertCircle className="h-4 w-4" />
      case 'baja': return <X className="h-4 w-4" />
      default: return <AlertCircle className="h-4 w-4" />
    }
  }

  return (
    <div className="p-6">
      <ToastContainer position="top-right" autoClose={3000} />
      
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestión de Empleados</h1>
          <p className="text-gray-600">Administra la información de todos los empleados</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => { resetForm(); setShowAddModal(true); }} 
            className="btn-primary"
          >
            <Plus className="h-4 w-4 mr-2" />
            Nuevo Empleado
          </button>
        </div>
      </div>

      {/* Status Info */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <div className="flex items-center">
            <AlertCircle className="h-5 w-5 text-red-400 mr-2" />
            <div>
              <h3 className="text-sm font-medium text-red-800">Error de Conexión</h3>
              <p className="text-sm text-red-700 mt-1">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input
            type="text"
            placeholder="Buscar empleados por nombre, apellido, CUIL o email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Employees Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {loading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Cargando empleados...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Empleado</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">CUIL</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contacto</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rol</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredEmployees.map((employee) => (
                  <tr key={employee.id_empleado} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                            <UserCheck className="h-6 w-6 text-blue-600" />
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {employee.nombre} {employee.apellido}
                          </div>
                          <div className="text-sm text-gray-500">{employee.domicilio}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-mono">
                      {employee.cuil}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col space-y-1">
                        <div className="flex items-center text-sm text-gray-900">
                          <Mail className="h-4 w-4 text-gray-400 mr-2" />
                          {employee.mail}
                        </div>
                        <div className="flex items-center text-sm text-gray-500">
                          <Phone className="h-4 w-4 text-gray-400 mr-2" />
                          {employee.telefono}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{employee.rol || '-'}</div>
                      {employee.sueldo && (
                        <div className="text-sm text-gray-500">${employee.sueldo.toLocaleString()}</div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(employee.estado || '')}`}>
                        {getStatusIcon(employee.estado || '')}
                        <span className="ml-1 capitalize">{employee.estado || 'N/A'}</span>
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEdit(employee)}
                          className="text-indigo-600 hover:text-indigo-900 p-1 rounded hover:bg-indigo-50"
                          title="Editar empleado"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleCreateLogin(employee)}
                          className="text-green-600 hover:text-green-900 p-1 rounded hover:bg-green-50"
                          title="Crear usuario de login"
                        >
                          <UserPlus className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(employee.id_empleado)}
                          className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50"
                          title="Eliminar empleado"
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
        
        {!loading && filteredEmployees.length === 0 && (
          <div className="p-8 text-center">
            <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No se encontraron empleados</p>
            {searchTerm && (
              <p className="text-sm text-gray-500 mt-2">
                Intenta con otros términos de búsqueda
              </p>
            )}
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">
                {editingEmployee ? 'Editar Empleado' : 'Nuevo Empleado'}
              </h2>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    CUIL *
                  </label>
                  <input
                    type="text"
                    name="cuil"
                    value={formData.cuil}
                    onChange={handleInputChange}
                    maxLength={11}
                    placeholder="12345678901"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nombre *
                  </label>
                  <input
                    type="text"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleInputChange}
                    placeholder="Nombre del empleado"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Apellido *
                  </label>
                  <input
                    type="text"
                    name="apellido"
                    value={formData.apellido}
                    onChange={handleInputChange}
                    placeholder="Apellido del empleado"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Domicilio *
                  </label>
                  <input
                    type="text"
                    name="domicilio"
                    value={formData.domicilio}
                    onChange={handleInputChange}
                    placeholder="Dirección completa"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Teléfono *
                  </label>
                  <input
                    type="tel"
                    name="telefono"
                    value={formData.telefono}
                    onChange={handleInputChange}
                    placeholder="+54 11 1234-5678"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email *
                  </label>
                  <input
                    type="email"
                    name="mail"
                    value={formData.mail}
                    onChange={handleInputChange}
                    placeholder="empleado@empresa.com"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Sueldo
                  </label>
                  <input
                    type="number"
                    name="sueldo"
                    value={formData.sueldo}
                    onChange={handleInputChange}
                    min="0"
                    step="0.01"
                    placeholder="0.00"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Rol
                  </label>
                  <select
                    name="id_rol"
                    value={formData.id_rol || ''}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Seleccionar rol</option>
                    {roles.map((rol) => (
                      <option key={rol.id_rol} value={rol.id_rol}>
                        {rol.descripcion}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Estado
                  </label>
                  <select
                    name="estado"
                    value={formData.estado}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="activo">Activo</option>
                    <option value="inactivo">Inactivo</option>
                    <option value="baja">Baja</option>
                  </select>
                </div>
              </div>
              
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => { setShowAddModal(false); resetForm(); }}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Guardando...
                    </div>
                  ) : (
                    <div className="flex items-center">
                      <Save className="h-4 w-4 mr-2" />
                      {editingEmployee ? 'Actualizar' : 'Crear'} Empleado
                    </div>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Create Login User Modal */}
      {showLoginModal && selectedEmployeeForLogin && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">
                Crear Usuario de Login
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                Para: {selectedEmployeeForLogin.nombre} {selectedEmployeeForLogin.apellido}
              </p>
            </div>
            
            <form onSubmit={handleCreateLoginSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Usuario *
                </label>
                <input
                  type="text"
                  name="usuario"
                  value={loginFormData.usuario}
                  onChange={handleLoginInputChange}
                  placeholder="Nombre de usuario"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Contraseña *
                </label>
                <input
                  type="password"
                  name="password"
                  value={loginFormData.password}
                  onChange={handleLoginInputChange}
                  placeholder="Contraseña"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Rol *
                </label>
                <select
                  name="id_rol"
                  value={loginFormData.id_rol || ''}
                  onChange={handleLoginInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  <option value="">Seleccionar rol</option>
                  {roles.map((rol) => (
                    <option key={rol.id_rol} value={rol.id_rol}>
                      {rol.descripcion}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => { setShowLoginModal(false); resetLoginForm(); }}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isCreatingLogin}
                  className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isCreatingLogin ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Creando...
                    </div>
                  ) : (
                    <div className="flex items-center">
                      <Key className="h-4 w-4 mr-2" />
                      Crear Usuario
                    </div>
                  )}
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

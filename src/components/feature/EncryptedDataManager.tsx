import { useState, useEffect } from 'react'
import { useEncryption } from '../../hooks/useEncryption'
import { type EncryptedData } from '../../lib/supabase'

interface EncryptedDataManagerProps {
  dataType: string
  title: string
  placeholder?: string
  multiline?: boolean
}

export default function EncryptedDataManager({ 
  dataType, 
  title, 
  placeholder = 'Güvenli veri girin...',
  multiline = false 
}: EncryptedDataManagerProps) {
  const { 
    loading, 
    error, 
    saveEncryptedData, 
    updateEncryptedData, 
    getEncryptedData, 
    deleteEncryptedData 
  } = useEncryption()
  
  const [data, setData] = useState<Array<EncryptedData & { decrypted_content: string }>>([])
  const [newContent, setNewContent] = useState('')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editContent, setEditContent] = useState('')
  const [showForm, setShowForm] = useState(false)

  useEffect(() => {
    loadData()
  }, [dataType])

  const loadData = async () => {
    const result = await getEncryptedData(dataType)
    if (!result.error) {
      setData(result.data)
    }
  }

  const handleSave = async () => {
    if (!newContent.trim()) return

    const result = await saveEncryptedData(dataType, newContent)
    if (result.success) {
      setNewContent('')
      setShowForm(false)
      await loadData()
    }
  }

  const handleUpdate = async (id: string) => {
    if (!editContent.trim()) return

    const result = await updateEncryptedData(id, editContent)
    if (result.success) {
      setEditingId(null)
      setEditContent('')
      await loadData()
    }
  }

  const handleDelete = async (id: string) => {
    if (window.confirm('Bu veriyi silmek istediğinizden emin misiniz?')) {
      const result = await deleteEncryptedData(id)
      if (result.success) {
        await loadData()
      }
    }
  }

  const startEdit = (item: EncryptedData & { decrypted_content: string }) => {
    setEditingId(item.id)
    setEditContent(item.decrypted_content)
  }

  const cancelEdit = () => {
    setEditingId(null)
    setEditContent('')
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
            <i className="ri-shield-keyhole-line text-blue-600"></i>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
            <p className="text-sm text-gray-600">Güvenli şekilde şifrelenmiş veriler</p>
          </div>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors cursor-pointer whitespace-nowrap"
        >
          <i className="ri-add-line mr-2"></i>
          Yeni Ekle
        </button>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-800 text-sm">{error}</p>
        </div>
      )}

      {showForm && (
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <div className="mb-4">
            {multiline ? (
              <textarea
                value={newContent}
                onChange={(e) => setNewContent(e.target.value)}
                placeholder={placeholder}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              />
            ) : (
              <input
                type="text"
                value={newContent}
                onChange={(e) => setNewContent(e.target.value)}
                placeholder={placeholder}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              />
            )}
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleSave}
              disabled={loading || !newContent.trim()}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer whitespace-nowrap"
            >
              {loading ? 'Kaydediliyor...' : 'Kaydet'}
            </button>
            <button
              onClick={() => {
                setShowForm(false)
                setNewContent('')
              }}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors cursor-pointer whitespace-nowrap"
            >
              İptal
            </button>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {data.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <i className="ri-file-shield-2-line text-4xl mb-2"></i>
            <p>Henüz şifreli veri yok</p>
          </div>
        ) : (
          data.map((item) => (
            <div key={item.id} className="p-4 border border-gray-200 rounded-lg">
              {editingId === item.id ? (
                <div>
                  <div className="mb-3">
                    {multiline ? (
                      <textarea
                        value={editContent}
                        onChange={(e) => setEditContent(e.target.value)}
                        rows={4}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                      />
                    ) : (
                      <input
                        type="text"
                        value={editContent}
                        onChange={(e) => setEditContent(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                      />
                    )}
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleUpdate(item.id)}
                      disabled={loading}
                      className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700 disabled:opacity-50 transition-colors cursor-pointer whitespace-nowrap"
                    >
                      Kaydet
                    </button>
                    <button
                      onClick={cancelEdit}
                      className="px-3 py-1 bg-gray-600 text-white text-sm rounded hover:bg-gray-700 transition-colors cursor-pointer whitespace-nowrap"
                    >
                      İptal
                    </button>
                  </div>
                </div>
              ) : (
                <div>
                  <div className="mb-3">
                    <div className="bg-gray-50 p-3 rounded border">
                      <pre className="whitespace-pre-wrap text-sm text-gray-800 font-mono">
                        {item.decrypted_content}
                      </pre>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <span>
                      Oluşturulma: {new Date(item.created_at).toLocaleDateString('tr-TR')}
                    </span>
                    <div className="flex gap-2">
                      <button
                        onClick={() => startEdit(item)}
                        className="px-2 py-1 text-blue-600 hover:bg-blue-50 rounded transition-colors cursor-pointer whitespace-nowrap"
                      >
                        <i className="ri-edit-line"></i>
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="px-2 py-1 text-red-600 hover:bg-red-50 rounded transition-colors cursor-pointer whitespace-nowrap"
                      >
                        <i className="ri-delete-bin-line"></i>
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  )
}
import { createContext, useContext, useState } from 'react'

const AnalysisContext = createContext()

const initialFormData = {
  eventName: '',
  organization: '',
  location: '',
  date: '',
  participants: '',
  duration: '',
  category: '',
  registration: '',
  certificates: '',
  marketing: '',
  transport: '',
  water: '',
  food: '',
  energy: '',
  wasteSegregation: '',
  initiatives: [],
}

export function AnalysisProvider({ children }) {
  const [formData, setFormData] = useState(initialFormData)

  const updateField = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const toggleInitiative = (initiative) => {
    setFormData((prev) => ({
      ...prev,
      initiatives: prev.initiatives.includes(initiative)
        ? prev.initiatives.filter((i) => i !== initiative)
        : [...prev.initiatives, initiative],
    }))
  }

  const resetForm = () => {
    setFormData(initialFormData)
  }

  const loadForm = (data) => {
    setFormData(data)
  }

  return (
    <AnalysisContext.Provider value={{
      formData,
      updateField,
      toggleInitiative,
      resetForm,
      loadForm,
    }}>
      {children}
    </AnalysisContext.Provider>
  )
}

export function useAnalysis() {
  const ctx = useContext(AnalysisContext)
  if (!ctx) throw new Error('useAnalysis must be used within AnalysisProvider')
  return ctx
}

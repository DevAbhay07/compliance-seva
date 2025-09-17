import { createSlice } from '@reduxjs/toolkit'

interface ComplianceRecord {
  id: string
  productName: string
  scanDate: string
  status: 'compliant' | 'violations' | 'critical'
  violations: string[]
  complianceScore: number
  image?: string
  details: {
    mrp?: string
    netQuantity?: string
    manufacturer?: string
    expiry?: string
    violations: Array<{
      type: string
      description: string
      severity: 'low' | 'medium' | 'high'
    }>
  }
}

interface ComplianceState {
  records: ComplianceRecord[]
  currentScan: ComplianceRecord | null
  isScanning: boolean
  stats: {
    totalScans: number
    compliantProducts: number
    violationsDetected: number
    criticalIssues: number
  }
}

const initialState: ComplianceState = {
  records: [
    // Sample data for demonstration
    {
      id: '1',
      productName: 'Sample Product A',
      scanDate: '2025-09-11',
      status: 'compliant',
      violations: [],
      complianceScore: 95,
      details: {
        mrp: '₹299',
        netQuantity: '500g',
        manufacturer: 'Sample Corp Ltd',
        violations: []
      }
    },
    {
      id: '2', 
      productName: 'Sample Product B',
      scanDate: '2025-09-10',
      status: 'violations',
      violations: ['Missing MRP declaration', 'Incorrect net quantity format'],
      complianceScore: 65,
      details: {
        netQuantity: '400ml',
        manufacturer: 'Test Industries',
        violations: [
          {
            type: 'MRP Declaration',
            description: 'MRP not clearly visible',
            severity: 'medium'
          }
        ]
      }
    }
  ],
  currentScan: null,
  isScanning: false,
  stats: {
    totalScans: 2,
    compliantProducts: 1,
    violationsDetected: 1,
    criticalIssues: 0
  }
}

const complianceSlice = createSlice({
  name: 'compliance',
  initialState,
  reducers: {
    startScan: (state) => {
      state.isScanning = true
    },
    completeScan: (state, action) => {
      state.isScanning = false
      state.currentScan = action.payload
      state.records.unshift(action.payload)
      state.stats.totalScans += 1
      
      // Update stats based on compliance status
      if (action.payload.status === 'compliant') {
        state.stats.compliantProducts += 1
      } else if (action.payload.status === 'violations') {
        state.stats.violationsDetected += 1
      } else if (action.payload.status === 'critical') {
        state.stats.criticalIssues += 1
      }
    },
    clearCurrentScan: (state) => {
      state.currentScan = null
    },
    deleteRecord: (state, action) => {
      const recordIndex = state.records.findIndex(record => record.id === action.payload)
      if (recordIndex !== -1) {
        const record = state.records[recordIndex]
        state.records.splice(recordIndex, 1)
        
        // Update stats
        state.stats.totalScans -= 1
        if (record.status === 'compliant') {
          state.stats.compliantProducts -= 1
        } else if (record.status === 'violations') {
          state.stats.violationsDetected -= 1
        } else if (record.status === 'critical') {
          state.stats.criticalIssues -= 1
        }
      }
    }
  }
})

export const {
  startScan,
  completeScan,
  clearCurrentScan,
  deleteRecord
} = complianceSlice.actions

export default complianceSlice.reducer
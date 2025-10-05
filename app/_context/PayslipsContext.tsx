import React, { createContext, useContext, useReducer } from 'react';
import { Assets } from '../../assets/ResouceManager';
import { Payslip } from '../_model/Payslip';

type State = {
  payslips: Payslip[];
};

const samplePayslips: Payslip[] = [
  {
    id: 'psl-2025-01',
    fromDate: '2025-01-01',
    toDate: '2025-01-31',
    fileName: 'sample-payslip.pdf',
    fileType: 'pdf',
    asset: Assets.SAMPLE_PDF,
  },
  {
    id: 'psl-2025-02',
    fromDate: '2025-02-01',
    toDate: '2025-02-28',
    fileName: 'sample-payslip.png',
    fileType: 'image',
    asset: Assets.SAMPLE_PNG,
  },
];

const initialState: State = {
  payslips: samplePayslips,
};

// Context type
const PayslipContext = createContext<{ state: State }>({
  state: initialState,
});

export const PayslipProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Simple reducer stub (you can extend later)
  const [state] = useReducer((s: State) => s, initialState);

  return (
    <PayslipContext.Provider value={{ state }}>
      {children}
    </PayslipContext.Provider>
  );
};

export const usePayslips = () => useContext(PayslipContext);

import React, { useState } from 'react';

type Props = React.InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
};

const PasswordField: React.FC<Props> = ({ label, ...rest }) => {
  const [visible, setVisible] = useState(false);

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      {label && <label style={{ minWidth: 90 }}>{label}</label>}
      <input
        {...rest}
        type={visible ? 'text' : 'password'}
        style={{ padding: '10px 12px', borderRadius: 8, border: '1px solid #e6e6e6', flex: 1 }}
      />
      <button
        type="button"
        onClick={() => setVisible((s) => !s)}
        style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#155DFC', fontWeight: 700 }}
      >
        {visible ? 'Ocultar' : 'Mostrar'}
      </button>
    </div>
  );
};

export default PasswordField;

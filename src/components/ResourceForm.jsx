import { useState } from "react";

// Formulario generado a partir de una lista de campos.
// field: { name, label, type, options, required, min, step, placeholder, full, onChange(form, value) => patch }
export default function ResourceForm({ id, fields, initial, onSubmit }) {
  const [form, setForm] = useState(initial);
  const [errors, setErrors] = useState({});

  const setValue = (field, value) => {
    const patch = field.onChange ? field.onChange(form, value) : {};
    setForm((f) => ({ ...f, [field.name]: value, ...patch }));
    if (errors[field.name]) setErrors((e) => ({ ...e, [field.name]: null }));
  };

  const validate = () => {
    const next = {};
    for (const f of fields) {
      const v = form[f.name];
      if (f.required && (v === "" || v === undefined || v === null)) next[f.name] = "Campo obligatorio";
      else if (f.type === "email" && v && !/^\S+@\S+\.\S+$/.test(v)) next[f.name] = "Email inválido";
      else if (f.type === "number" && v !== "" && f.min !== undefined && Number(v) < f.min)
        next[f.name] = `Debe ser mayor o igual a ${f.min}`;
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) onSubmit(form);
  };

  return (
    <form id={id} className="form-grid" onSubmit={handleSubmit} noValidate>
      {fields.map((f) => {
        const inputId = `${id}-${f.name}`;
        const common = {
          id: inputId,
          name: f.name,
          value: form[f.name] ?? "",
          onChange: (e) => setValue(f, f.type === "number" ? (e.target.value === "" ? "" : Number(e.target.value)) : e.target.value),
          "aria-invalid": errors[f.name] ? true : undefined,
          className: "input",
        };
        return (
          <div key={f.name} className={`field ${f.full ? "field-full" : ""}`}>
            <label htmlFor={inputId}>
              {f.label}
              {f.required && <span className="req"> *</span>}
            </label>
            {f.type === "select" ? (
              <select {...common}>
                <option value="">Seleccionar…</option>
                {f.options.map((o) => {
                  const value = typeof o === "string" ? o : o.value;
                  const label = typeof o === "string" ? o : o.label;
                  return (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  );
                })}
              </select>
            ) : (
              <input {...common} type={f.type ?? "text"} placeholder={f.placeholder} min={f.min} step={f.step} />
            )}
            {errors[f.name] && <span className="field-error">{errors[f.name]}</span>}
          </div>
        );
      })}
    </form>
  );
}

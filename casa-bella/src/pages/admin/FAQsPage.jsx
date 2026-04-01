import { useState, useEffect } from 'react';
import {
  Card,
  CardBody,
  CardHeader,
  Button,
  Input,
  TextArea,
  Loading,
  SuccessAlert,
  ErrorAlert,
} from '../../shared/components/ui';
import { getFAQs, updateFAQs, createDefaultFAQs } from '../../shared/services/faqsService';

export const FAQsPage = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);
  const [faqs, setFaqs] = useState([]);

  useEffect(() => {
    loadFAQs();
  }, []);

  const loadFAQs = async () => {
    try {
      setLoading(true);
      await createDefaultFAQs();
      const data = await getFAQs();
      setFaqs(data);
      setLoading(false);
    } catch (error) {
      console.error('Error loading FAQs:', error);
      setError('Error al cargar las preguntas frecuentes');
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setSaving(true);
      setError(null);
      
      // Filter out empty FAQs and assign order
      const validFAQs = faqs
        .filter(faq => faq.question.trim() !== '' && faq.answer.trim() !== '')
        .map((faq, index) => ({ ...faq, order: index + 1 }));
      
      await updateFAQs(validFAQs);
      
      setSuccess('Preguntas frecuentes actualizadas correctamente');
      setSaving(false);
      setTimeout(() => setSuccess(null), 3000);
    } catch (error) {
      console.error('Error saving FAQs:', error);
      setError('Error al guardar las preguntas frecuentes');
      setSaving(false);
    }
  };

  const updateFAQ = (index, field, value) => {
    const newFAQs = [...faqs];
    newFAQs[index] = { ...newFAQs[index], [field]: value };
    setFaqs(newFAQs);
  };

  const addFAQ = () => {
    setFaqs([
      ...faqs,
      {
        id: `faq-${Date.now()}`,
        question: '',
        answer: '',
        order: faqs.length + 1,
      }
    ]);
  };

  const removeFAQ = (index) => {
    const newFAQs = faqs.filter((_, i) => i !== index);
    setFaqs(newFAQs);
  };

  const moveFAQUp = (index) => {
    if (index === 0) return;
    const newFAQs = [...faqs];
    [newFAQs[index - 1], newFAQs[index]] = [newFAQs[index], newFAQs[index - 1]];
    setFaqs(newFAQs);
  };

  const moveFAQDown = (index) => {
    if (index === faqs.length - 1) return;
    const newFAQs = [...faqs];
    [newFAQs[index], newFAQs[index + 1]] = [newFAQs[index + 1], newFAQs[index]];
    setFaqs(newFAQs);
  };

  if (loading) {
    return <Loading message="Cargando preguntas frecuentes..." />;
  }

  return (
    <div>
      <div className="mb-4">
        <h2>Gestión de Preguntas Frecuentes</h2>
        <p className="text-secondary">Administra las FAQs de la página de contacto</p>
      </div>

      {success && <SuccessAlert message={success} onClose={() => setSuccess(null)} />}
      {error && <ErrorAlert message={error} onClose={() => setError(null)} />}

      <form onSubmit={handleSubmit}>
        <Card hover={false} className="mb-4">
          <CardHeader>
            <div className="d-flex justify-content-between align-items-center">
              <h5 className="mb-0">Preguntas Frecuentes</h5>
              <Button type="button" size="sm" onClick={addFAQ}>
                + Agregar Pregunta
              </Button>
            </div>
          </CardHeader>
          <CardBody>
            {faqs.length === 0 ? (
              <div className="text-center py-4">
                <p className="text-muted mb-3">No hay preguntas frecuentes</p>
                <Button type="button" variant="outline" onClick={addFAQ}>
                  + Agregar Primera Pregunta
                </Button>
              </div>
            ) : (
              faqs.map((faq, index) => (
                <div key={faq.id} className="mb-4 pb-4 border-bottom">
                  <div className="d-flex justify-content-between align-items-start mb-3">
                    <h6>Pregunta {index + 1}</h6>
                    <div className="d-flex gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => moveFAQUp(index)}
                        disabled={index === 0}
                        title="Mover arriba"
                      >
                        ⬆️
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => moveFAQDown(index)}
                        disabled={index === faqs.length - 1}
                        title="Mover abajo"
                      >
                        ⬇️
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => removeFAQ(index)}
                        title="Eliminar"
                      >
                        🗑️
                      </Button>
                    </div>
                  </div>

                  <Input
                    label="Pregunta"
                    value={faq.question}
                    onChange={(e) => updateFAQ(index, 'question', e.target.value)}
                    placeholder="¿Cuál es tu pregunta?"
                    className="mb-3"
                  />

                  <TextArea
                    label="Respuesta"
                    value={faq.answer}
                    onChange={(e) => updateFAQ(index, 'answer', e.target.value)}
                    placeholder="Escribe la respuesta aquí..."
                    rows={4}
                  />
                </div>
              ))
            )}
          </CardBody>
        </Card>

        <div className="d-flex gap-3">
          <Button type="submit" disabled={saving}>
            {saving ? 'Guardando...' : 'Guardar Cambios'}
          </Button>
          <Button type="button" variant="outline" onClick={loadFAQs}>
            Cancelar
          </Button>
        </div>
      </form>
    </div>
  );
};

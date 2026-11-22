import { useState, type FormEvent } from 'react';
import { PROCESSING_LINES } from '../data/processingLinesData';
import { EQUIPMENTS_LIST } from '../pages/EquipmentsPage';
import { normalizeMediaSlot } from '../services/publishedMedia';

const inputClass = 'w-full rounded-xl border border-border-strong bg-ivory px-4 py-3 text-ink';

export function AdminMediaPublisher({ onSessionExpired }: { onSessionExpired: () => void }) {
  const [section, setSection] = useState('gallery');
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');

  async function publish(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy) return;
    const form = event.currentTarget;
    const data = new FormData(form);
    setBusy(true);
    setMessage('');
    try {
      const response = await fetch('/api/admin/media', { method: 'POST', body: data });
      if (response.status === 401) {
        onSessionExpired();
        return;
      }
      const result = await response.json();
      if (!response.ok || !result.ok) {
        setMessage(result.error || 'Could not publish this image.');
        return;
      }
      form.reset();
      setMessage('Photo published. Allow up to a minute for the public page to refresh.');
    } catch {
      setMessage('Could not confirm publication. Check the public page before retrying.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="mb-8 rounded-2xl border border-border bg-ivory p-6 text-ink">
      <h2 className="mb-2 font-display text-2xl">Publish a website photo</h2>
      <p className="mb-5 text-sm">Upload a JPEG, PNG, or WebP image up to 5 MB from your laptop.</p>
      <form onSubmit={publish}>
        <fieldset disabled={busy} className="grid gap-4 sm:grid-cols-2">
          <label>Destination
            <select name="section" value={section} onChange={(event) => setSection(event.target.value)} className={inputClass}>
              <option value="gallery">Gallery</option>
              <option value="homepage_hero">Homepage hero</option>
              <option value="processing_line">Processing line</option>
              <option value="equipment">Equipment</option>
            </select>
          </label>
          {section === 'processing_line' && (
            <label>Processing line
              <select key={section} name="slot" className={inputClass}>
                {PROCESSING_LINES.map((line) => <option key={line.slug} value={normalizeMediaSlot(line.slug)}>{line.name}</option>)}
              </select>
            </label>
          )}
          {section === 'equipment' && (
            <label>Equipment
              <select key={section} name="slot" className={inputClass}>
                {EQUIPMENTS_LIST.map((name) => <option key={name} value={normalizeMediaSlot(name)}>{name}</option>)}
              </select>
            </label>
          )}
          <label>Title<input name="title" required maxLength={160} className={inputClass} /></label>
          <label>Alternative text<input name="altText" maxLength={240} className={inputClass} /></label>
          {section === 'gallery' && (
            <label>Category
              <select name="category" className={inputClass}>
                <option value="processing-line">Processing line</option>
                <option value="equipment">Equipment</option>
                <option value="installation">Installation</option>
              </select>
            </label>
          )}
          <label>Photo<input name="image" type="file" required accept="image/jpeg,image/png,image/webp" className={inputClass} /></label>
          <button type="submit" className="justify-self-start rounded-xl bg-ink px-5 py-3 text-ivory">
            {busy ? 'Publishing…' : 'Publish photo'}
          </button>
        </fieldset>
      </form>
      <p role="status" className="mt-4 text-sm">{message}</p>
    </section>
  );
}

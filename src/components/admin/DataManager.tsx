import React, { useState } from 'react';
import { Download, UploadCloud, FileText, AlertCircle, CheckCircle2, Loader2, Database } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import Papa from 'papaparse';

const TABLES = [
  { 
    id: 'products', 
    name: 'Produtos', 
    columns: [
      'name', 'sku', 'description', 'price', 'weight', 'category_id', 'producer', 
      'region', 'harvest', 'capacity', 'alcohol_content', 'stock', 'tax_rate', 'image', 'published'
    ] 
  },
  { 
    id: 'categories', 
    name: 'Categorias', 
    columns: ['name', 'slug', 'parent_id'] 
  }
];

export default function DataManager() {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error', message: string } | null>(null);

  const exportData = async (tableId: string) => {
    const { data, error } = await supabase.from(tableId).select('*');
    
    if (error) {
      setStatus({ type: 'error', message: `Erro ao exportar dados: ${error.message}` });
      return;
    }

    if (!data || data.length === 0) {
      setStatus({ type: 'error', message: 'Não existem dados para exportar nesta tabela.' });
      return;
    }

    const csv = Papa.unparse(data);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `export_${tableId}_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const downloadTemplate = (tableId: string) => {
    const table = TABLES.find(t => t.id === tableId);
    if (!table) return;

    // Create empty row with headers
    const csv = Papa.unparse([
      table.columns.reduce((acc, col) => ({ ...acc, [col]: '' }), {})
    ]);

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `template_${tableId}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleFileUpload = async (tableId: string, event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setLoading(true);
    setStatus(null);

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: async (results) => {
        try {
          // Clean data: replace empty strings with null for UUID columns or others
          const cleanedData = results.data.map((row: any) => {
            const newRow = { ...row };
            Object.keys(newRow).forEach(key => {
              if (newRow[key] === '') {
                newRow[key] = null;
              }
            });
            return newRow;
          });

          const { error } = await supabase
            .from(tableId)
            .insert(cleanedData);

          if (error) throw error;

          setStatus({ 
            type: 'success', 
            message: `${cleanedData.length} registos importados com sucesso na tabela ${tableId}.` 
          });
        } catch (err: any) {
          setStatus({ 
            type: 'error', 
            message: `Erro na importação: ${err.message}` 
          });
        } finally {
          setLoading(false);
          // Reset input
          event.target.value = '';
        }
      },
      error: (error) => {
        setStatus({ type: 'error', message: `Erro ao ler ficheiro: ${error.message}` });
        setLoading(false);
      }
    });
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {TABLES.map(table => (
          <div key={table.id} className="bg-white p-8 rounded-sm border border-gray-100 shadow-sm space-y-6">
            <div className="flex items-center justify-between border-b border-gray-50 pb-4">
              <h3 className="text-[10px] font-black tracking-[0.2em] uppercase text-brand-red flex items-center gap-2">
                <Database size={14} /> {table.name}
              </h3>
            </div>
            
            <div className="space-y-4">
              <div className="p-4 bg-gray-50 rounded-sm space-y-4">
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">1. Obter Ficheiros (CSV)</p>
                  <p className="text-xs text-gray-500 mt-1">Descarregue o modelo vazio ou exporte os dados atuais.</p>
                </div>
                <div className="flex flex-wrap gap-4">
                  <button
                    onClick={() => downloadTemplate(table.id)}
                    className="flex items-center gap-2 text-brand-charcoal hover:text-brand-red transition-colors text-[10px] font-bold uppercase tracking-wider bg-white px-3 py-2 border border-gray-100 rounded-sm"
                  >
                    <Download size={14} /> Modelo Vazio
                  </button>
                  <button
                    onClick={() => exportData(table.id)}
                    className="flex items-center gap-2 text-brand-charcoal hover:text-brand-red transition-colors text-[10px] font-bold uppercase tracking-wider bg-white px-3 py-2 border border-gray-100 rounded-sm"
                  >
                    <FileText size={14} /> Exportar Dados Reais
                  </button>
                </div>
              </div>

              <div className="p-4 border-2 border-dashed border-gray-100 rounded-sm space-y-3 hover:border-brand-red/20 transition-all">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">2. Carregar Dados</p>
                <p className="text-xs text-gray-500">Selecione o ficheiro CSV preenchido para importar.</p>
                
                <label className="relative inline-block group cursor-pointer">
                  <input
                    type="file"
                    accept=".csv"
                    onChange={(e) => handleFileUpload(table.id, e)}
                    disabled={loading}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                  <div className={`flex items-center gap-2 px-6 py-3 rounded-sm text-[10px] font-bold tracking-widest uppercase transition-all ${loading ? 'bg-gray-100 text-gray-400' : 'bg-brand-charcoal text-white hover:bg-brand-charcoal/90'}`}>
                    {loading ? <Loader2 className="animate-spin" size={14} /> : <UploadCloud size={14} />}
                    {loading ? 'A processar...' : 'Selecionar Ficheiro'}
                  </div>
                </label>
              </div>
            </div>
          </div>
        ))}
      </div>

      {status && (
        <div className={`p-6 rounded-sm flex items-start gap-4 border ${status.type === 'success' ? 'bg-green-50 border-green-100 text-green-800' : 'bg-red-50 border-red-100 text-brand-red'}`}>
          {status.type === 'success' ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
          <div>
            <p className="text-xs font-bold uppercase tracking-widest mb-1">{status.type === 'success' ? 'Sucesso' : 'Erro'}</p>
            <p className="text-sm font-sans">{status.message}</p>
          </div>
        </div>
      )}

      <div className="bg-amber-50 border border-amber-100 p-6 rounded-sm flex items-start gap-4">
        <AlertCircle className="text-amber-600 shrink-0" size={20} />
        <div className="space-y-1">
          <p className="text-[10px] font-bold text-amber-900 uppercase tracking-widest">Instruções Importantes</p>
          <ul className="text-xs text-amber-800 space-y-1 list-disc ml-4">
            <li>O ficheiro deve estar no formato <strong>CSV</strong> (separado por vírgulas).</li>
            <li>Não altere os nomes das colunas na primeira linha do template.</li>
            <li>No campo <strong>category_id</strong>, deve usar o UUID da categoria (pode consultar no menu Categorias).</li>
            <li>Imagens devem ser URLs completas ou deixadas em branco para carregar manualmente depois.</li>
            <li>Campos booleanos (como <strong>published</strong>) devem ser preenchidos com <code>true</code> ou <code>false</code>.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

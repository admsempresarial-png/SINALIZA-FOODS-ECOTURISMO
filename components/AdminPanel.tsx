
import React, { useState } from 'react';
import { X, Lock, Download, MessageSquare, Search, Trash2, Store, MapPin, Tag, Plus, Check, Zap, Edit, Layout, Image, Users, Upload, RefreshCw, AlertTriangle, Star, Instagram, CreditCard } from 'lucide-react';
import { useLead } from './LeadContext';
import { OfferType, SiteConfig } from '../types';

const AdminPanel: React.FC = () => {
  const { 
    leads, 
    isAdminOpen, 
    setIsAdminOpen, 
    companies, 
    addCompany, 
    removeCompany,
    siteConfig,
    updateSiteConfig
  } = useLead();
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'leads' | 'content' | 'site_editor'>('leads');

  // Form State for New Company
  const [newCompany, setNewCompany] = useState({
    name: '',
    address: '',
    productName: '',
    offerType: 'fixed_price' as OfferType,
    originalPrice: '',
    vipPrice: '',
    discountLabel: '',
    instagram: '',
    active: true,
    isHighlight: false,
    couponCode: ''
  });

  // Local state for editing site config
  const [editConfig, setEditConfig] = useState<SiteConfig>(siteConfig);

  // Sync editConfig when siteConfig changes (e.g. initial load)
  React.useEffect(() => {
    setEditConfig(siteConfig);
  }, [siteConfig]);

  if (!isAdminOpen) return null;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === '576101382.Ga') {
      setIsAuthenticated(true);
    } else {
      alert('Senha incorreta!');
    }
  };

  const handleExport = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + "Nome,CPF,WhatsApp,Email,Data Cadastro\n"
      + leads.map(l => `${l.name},${l.cpf},${l.whatsapp},${l.email},${new Date(l.createdAt).toLocaleString()}`).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "sinaliza_leads.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleAddCompany = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Explicit Validations
    if (!newCompany.name.trim()) {
        alert("Erro: O campo 'Nome da Empresa' é obrigatório.");
        return;
    }
    if (!newCompany.address.trim()) {
        alert("Erro: O campo 'Endereço' é obrigatório.");
        return;
    }
    if (!newCompany.productName.trim()) {
        alert("Erro: O campo 'Nome do Produto/Oferta' é obrigatório.");
        return;
    }

    if (newCompany.offerType === 'fixed_price') {
        if (!newCompany.originalPrice || !newCompany.vipPrice) {
            alert("Erro: Para oferta de Preço Fixo, preencha os valores 'Preço Original' e 'Preço VIP'.");
            return;
        }
    } else if (newCompany.offerType === 'percentage') {
         if (!newCompany.discountLabel) {
             alert("Erro: Informe a porcentagem do desconto.");
             return;
         }
    } else {
        if (!newCompany.discountLabel) {
            alert("Erro: Preencha o detalhe do desconto.");
            return;
        }
    }

    if (newCompany.isHighlight && !newCompany.couponCode) {
        alert("Erro: Se você marcou para liberar o desconto (Destaque VIP), é obrigatório criar uma Palavra-Chave/Código.");
        return;
    }

    addCompany(newCompany);
    
    setNewCompany({
        name: '',
        address: '',
        productName: '',
        offerType: 'fixed_price',
        originalPrice: '',
        vipPrice: '',
        discountLabel: '',
        instagram: '',
        active: true,
        isHighlight: false,
        couponCode: ''
    });
    alert("Empresa cadastrada com sucesso!");
  };

  const handleSaveSiteConfig = async () => {
    try {
      await updateSiteConfig(editConfig);
      alert("Configurações e imagens salvas com sucesso!");
    } catch (error: any) {
      console.error("Erro ao salvar config:", error);
      alert("Ocorreu um erro ao salvar no banco de dados. Tente novamente.");
    }
  };

  // Helper function to handle image upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, callback: (base64: string) => void) => {
    const file = e.target.files?.[0];
    if (file) {
      // With IndexedDB, we can support much larger files. 
      // We process the file directly to Base64 without aggressive size checks.
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          callback(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Helper component to render image input with preview and upload
  const renderImageInput = (label: string, value: string, onChange: (val: string) => void) => (
    <div className="space-y-2">
        <label className="text-xs text-gray-400 font-bold block">{label}</label>
        <div className="flex gap-3 items-start">
            {/* Preview */}
            <div className="w-16 h-16 bg-neutral-800 rounded-lg border border-neutral-700 overflow-hidden shrink-0 relative group">
                {value ? (
                    <img src={value} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-600">
                        <Image size={20} />
                    </div>
                )}
            </div>
            
            <div className="flex-1 space-y-2">
                {/* URL Input */}
                <input 
                    type="text" 
                    placeholder="Cole a URL ou faça upload..."
                    className="w-full bg-neutral-800 border border-neutral-700 text-white px-3 py-1.5 rounded text-xs focus:border-red-500 focus:outline-none"
                    value={value && value.startsWith('data:') ? '' : value}
                    onChange={(e) => onChange(e.target.value)}
                />
                
                {/* File Upload Button */}
                <label className="flex items-center justify-center gap-2 bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 text-gray-300 text-xs py-1.5 px-3 rounded cursor-pointer transition-colors w-full relative">
                    <Upload size={14} />
                    <span>Upload Alta Qualidade (PC/Celular)</span>
                    <input 
                        type="file" 
                        accept="image/*" 
                        className="hidden" 
                        onChange={(e) => handleImageUpload(e, onChange)}
                    />
                </label>
            </div>
        </div>
        {value && value.startsWith('data:image') && (
            <p className="text-[10px] text-green-500 flex items-center gap-1">
                <Check size={10} /> Imagem carregada e pronta para salvar.
            </p>
        )}
    </div>
  );

  const filteredLeads = leads.filter(lead => 
    lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lead.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lead.cpf?.includes(searchTerm) ||
    lead.whatsapp.includes(searchTerm)
  );

  return (
    <div className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#121212] w-full max-w-6xl h-[90vh] rounded-2xl border border-neutral-800 shadow-2xl flex flex-col overflow-hidden">
        
        {/* Header */}
        <div className="bg-neutral-900 p-6 flex justify-between items-center border-b border-neutral-800">
          <div className="flex items-center gap-3">
             <div className="bg-red-600 p-2 rounded">
                 <Store className="text-white w-5 h-5" />
             </div>
             <div>
                <h2 className="text-xl font-bold text-white">Painel Administrativo</h2>
                <p className="text-xs text-gray-400">Sinaliza Foods Manager</p>
             </div>
          </div>
          <button 
            onClick={() => setIsAdminOpen(false)}
            className="text-gray-400 hover:text-white p-2 hover:bg-neutral-800 rounded-lg transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden flex">
          {!isAuthenticated ? (
            <div className="w-64 flex flex-col items-center justify-center max-w-sm mx-auto p-6">
                <Lock className="w-16 h-16 text-red-600 mb-6" />
                <h3 className="text-2xl font-bold text-white mb-6">Acesso Restrito</h3>
                <form onSubmit={handleLogin} className="w-full space-y-4">
                    <input 
                        type="password" 
                        placeholder="Digite a senha de admin"
                        className="w-full bg-neutral-800 border border-neutral-700 text-white px-4 py-3 rounded-lg focus:outline-none focus:border-red-500"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <button type="submit" className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-lg transition-colors">
                        ACESSAR SISTEMA
                    </button>
                </form>
            </div>
          ) : (
            <>
                {/* Sidebar */}
                <div className="w-64 bg-neutral-900/50 border-r border-neutral-800 p-4 hidden md:flex flex-col gap-2 overflow-y-auto">
                    <button 
                        onClick={() => setActiveTab('leads')}
                        className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-bold transition-colors ${activeTab === 'leads' ? 'bg-red-600 text-white' : 'text-gray-400 hover:bg-neutral-800 hover:text-white'}`}
                    >
                        <MessageSquare size={18} /> Leads / Cadastros
                    </button>
                    
                    <div className="pt-4 pb-2 text-xs font-bold text-gray-500 uppercase tracking-wider px-4">
                        Gestão de Conteúdo
                    </div>
                    
                    <button 
                        onClick={() => setActiveTab('content')}
                        className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-bold transition-colors ${activeTab === 'content' ? 'bg-red-600 text-white' : 'text-gray-400 hover:bg-neutral-800 hover:text-white'}`}
                    >
                        <Store size={18} /> Cadastrar Empresa
                    </button>

                    <button 
                        onClick={() => setActiveTab('site_editor')}
                        className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-bold transition-colors ${activeTab === 'site_editor' ? 'bg-red-600 text-white' : 'text-gray-400 hover:bg-neutral-800 hover:text-white'}`}
                    >
                        <Layout size={18} /> Editar Site (Geral)
                    </button>
                </div>

                {/* Main Content Area */}
                <div className="flex-1 overflow-hidden flex flex-col p-6 overflow-y-auto custom-scrollbar">
                    {activeTab === 'leads' && (
                        <>
                            {/* Leads Toolbar */}
                            <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
                                <div className="relative flex-1 max-w-md">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
                                    <input 
                                        type="text" 
                                        placeholder="Buscar por nome, email, cpf..."
                                        className="w-full bg-neutral-800 border border-neutral-700 text-white pl-10 pr-4 py-2 rounded-lg focus:outline-none focus:border-red-500"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                </div>
                                <div className="flex gap-4 items-center">
                                    <div className="text-gray-400 text-sm">
                                        Total: <span className="text-white font-bold">{leads.length}</span> leads
                                    </div>
                                    <button 
                                        onClick={handleExport}
                                        className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-bold text-sm transition-colors"
                                    >
                                        <Download size={16} /> Exportar CSV
                                    </button>
                                </div>
                            </div>

                            {/* Leads Table */}
                            <div className="flex-1 overflow-auto bg-neutral-900 rounded-lg border border-neutral-800 custom-scrollbar">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="bg-neutral-800 text-gray-400 text-sm uppercase">
                                            <th className="p-4 border-b border-neutral-700">Data</th>
                                            <th className="p-4 border-b border-neutral-700">Nome</th>
                                            <th className="p-4 border-b border-neutral-700">CPF</th>
                                            <th className="p-4 border-b border-neutral-700">WhatsApp</th>
                                            <th className="p-4 border-b border-neutral-700">Email</th>
                                            <th className="p-4 border-b border-neutral-700 text-right">Ações</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredLeads.length === 0 ? (
                                            <tr>
                                                <td colSpan={6} className="p-8 text-center text-gray-500">
                                                    Nenhum lead encontrado.
                                                </td>
                                            </tr>
                                        ) : (
                                            filteredLeads.map((lead) => (
                                                <tr key={lead.id} className="border-b border-neutral-800 hover:bg-neutral-800/50 transition-colors">
                                                    <td className="p-4 text-gray-400 text-sm">
                                                        {new Date(lead.createdAt).toLocaleDateString()} <br/>
                                                        <span className="text-xs opacity-50">{new Date(lead.createdAt).toLocaleTimeString()}</span>
                                                    </td>
                                                    <td className="p-4 text-white font-medium">{lead.name}</td>
                                                    <td className="p-4 text-gray-300 font-mono text-sm">{lead.cpf}</td>
                                                    <td className="p-4 text-gray-300">{lead.whatsapp}</td>
                                                    <td className="p-4 text-gray-300">{lead.email}</td>
                                                    <td className="p-4 text-right">
                                                        <a 
                                                            href={`https://wa.me/55${lead.whatsapp.replace(/\D/g, '')}`} 
                                                            target="_blank" 
                                                            rel="noopener noreferrer"
                                                            className="inline-flex items-center gap-1 bg-green-600/10 text-green-500 hover:bg-green-600 hover:text-white px-3 py-1.5 rounded text-xs font-bold transition-colors"
                                                        >
                                                            <MessageSquare size={14} /> Chamar
                                                        </a>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </>
                    )}
                    
                    {activeTab === 'content' && (
                        <div className="flex flex-col h-full gap-6">
                            {/* Form de Cadastro */}
                            <div className="bg-neutral-900/50 p-6 rounded-xl border border-neutral-800 overflow-y-auto custom-scrollbar">
                                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                                    <Plus size={20} className="text-red-500" />
                                    Adicionar Nova Empresa VIP
                                </h3>
                                <form onSubmit={handleAddCompany} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="col-span-1">
                                        <label className="text-xs text-gray-400 font-bold block mb-1">Nome da Empresa <span className="text-red-500">*</span></label>
                                        <input 
                                            type="text" 
                                            
                                            className="w-full bg-neutral-800 border border-neutral-700 text-white px-3 py-2 rounded focus:border-red-500 focus:outline-none"
                                            value={newCompany.name}
                                            onChange={(e) => setNewCompany({...newCompany, name: e.target.value})}
                                        />
                                    </div>
                                    <div className="col-span-1">
                                        <label className="text-xs text-gray-400 font-bold block mb-1">Endereço (para o Google Maps) <span className="text-red-500">*</span></label>
                                        <input 
                                            type="text" 
                                            
                                            className="w-full bg-neutral-800 border border-neutral-700 text-white px-3 py-2 rounded focus:border-red-500 focus:outline-none"
                                            value={newCompany.address}
                                            onChange={(e) => setNewCompany({...newCompany, address: e.target.value})}
                                        />
                                    </div>
                                    <div className="col-span-1">
                                        <label className="text-xs text-gray-400 font-bold block mb-1">Nome do Produto/Oferta <span className="text-red-500">*</span></label>
                                        <input 
                                            type="text" 
                                            
                                            placeholder="Ex: Pizza Grande, Rodízio..."
                                            className="w-full bg-neutral-800 border border-neutral-700 text-white px-3 py-2 rounded focus:border-red-500 focus:outline-none"
                                            value={newCompany.productName}
                                            onChange={(e) => setNewCompany({...newCompany, productName: e.target.value})}
                                        />
                                    </div>
                                    
                                    <div className="col-span-1">
                                        <label className="text-xs text-gray-400 font-bold block mb-1">Tipo de Oferta/Desconto</label>
                                        <select 
                                            className="w-full bg-neutral-800 border border-neutral-700 text-white px-3 py-2 rounded focus:border-red-500 focus:outline-none"
                                            value={newCompany.offerType}
                                            onChange={(e) => setNewCompany({...newCompany, offerType: e.target.value as OfferType, discountLabel: ''})}
                                        >
                                            <option value="fixed_price">Preço Fixo (De R$ X por R$ Y)</option>
                                            <option value="percentage">Porcentagem (Ex: 20% OFF)</option>
                                            <option value="b1g1">Pague 1 Leve 2</option>
                                            <option value="delivery">Entrega Grátis</option>
                                            <option value="gift">Brinde Exclusivo</option>
                                        </select>
                                    </div>

                                    {/* Conditional Fields based on Offer Type */}
                                    {newCompany.offerType === 'fixed_price' && (
                                        <>
                                            <div className="col-span-1">
                                                <label className="text-xs text-gray-400 font-bold block mb-1">Preço Original <span className="text-red-500">*</span></label>
                                                <input 
                                                    type="text" 
                                                    placeholder="R$ 00,00"
                                                    className="w-full bg-neutral-800 border border-neutral-700 text-white px-3 py-2 rounded focus:border-red-500 focus:outline-none"
                                                    value={newCompany.originalPrice}
                                                    onChange={(e) => setNewCompany({...newCompany, originalPrice: e.target.value})}
                                                />
                                            </div>
                                            <div className="col-span-1">
                                                <label className="text-xs text-gray-400 font-bold block mb-1">Preço VIP <span className="text-red-500">*</span></label>
                                                <input 
                                                    type="text" 
                                                    placeholder="R$ 00,00"
                                                    className="w-full bg-neutral-800 border border-neutral-700 text-white px-3 py-2 rounded focus:border-red-500 focus:outline-none"
                                                    value={newCompany.vipPrice}
                                                    onChange={(e) => setNewCompany({...newCompany, vipPrice: e.target.value})}
                                                />
                                            </div>
                                        </>
                                    )}

                                    {newCompany.offerType === 'percentage' && (
                                        <div className="col-span-2">
                                            <label className="text-xs text-gray-400 font-bold block mb-1">Valor da Porcentagem <span className="text-red-500">*</span></label>
                                            <div className="relative">
                                                <input 
                                                    type="number" 
                                                    placeholder="Ex: 20"
                                                    className="w-full bg-neutral-800 border border-neutral-700 text-white px-3 py-2 rounded focus:border-red-500 focus:outline-none pr-16 font-bold text-lg"
                                                    value={newCompany.discountLabel ? newCompany.discountLabel.replace('% OFF', '') : ''}
                                                    onChange={(e) => setNewCompany({...newCompany, discountLabel: e.target.value ? `${e.target.value}% OFF` : ''})}
                                                />
                                                <div className="absolute right-3 top-1/2 -translate-y-1/2 text-red-500 font-bold pointer-events-none">
                                                    % OFF
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {['b1g1', 'delivery', 'gift'].includes(newCompany.offerType) && (
                                        <div className="col-span-2">
                                            <label className="text-xs text-gray-400 font-bold block mb-1">Detalhe do Desconto <span className="text-red-500">*</span></label>
                                            <input 
                                                type="text" 
                                                placeholder={
                                                    newCompany.offerType === 'b1g1' ? "Ex: Compre 1 Pizza e Ganhe 1 Broto" :
                                                    newCompany.offerType === 'delivery' ? "Ex: Entrega Grátis acima de R$ 50" :
                                                    "Ex: Ganhe um refrigerante"
                                                }
                                                className="w-full bg-neutral-800 border border-neutral-700 text-white px-3 py-2 rounded focus:border-red-500 focus:outline-none"
                                                value={newCompany.discountLabel}
                                                onChange={(e) => setNewCompany({...newCompany, discountLabel: e.target.value})}
                                            />
                                        </div>
                                    )}

                                    <div className="col-span-2">
                                        <label className="text-xs text-gray-400 font-bold block mb-1">Link do Instagram (Opcional)</label>
                                        <div className="relative">
                                            <Instagram className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4" />
                                            <input 
                                                type="text" 
                                                placeholder="https://instagram.com/seuperfil"
                                                className="w-full bg-neutral-800 border border-neutral-700 text-white pl-9 pr-3 py-2 rounded focus:border-red-500 focus:outline-none"
                                                value={newCompany.instagram}
                                                onChange={(e) => setNewCompany({...newCompany, instagram: e.target.value})}
                                            />
                                        </div>
                                    </div>

                                    {/* Authorize Discount / Keyword Section */}
                                    <div className="col-span-2 bg-neutral-800/50 p-4 rounded-lg border border-neutral-700 mt-2">
                                        <label className="flex items-center gap-3 cursor-pointer mb-4">
                                            <div className="relative">
                                                <input 
                                                    type="checkbox" 
                                                    className="peer sr-only"
                                                    checked={newCompany.isHighlight}
                                                    onChange={(e) => setNewCompany({...newCompany, isHighlight: e.target.checked})}
                                                />
                                                <div className="w-10 h-6 bg-neutral-700 rounded-full peer-checked:bg-purple-600 transition-colors"></div>
                                                <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform peer-checked:translate-x-4"></div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Zap className={`w-4 h-4 ${newCompany.isHighlight ? 'text-purple-400' : 'text-gray-500'}`} />
                                                <span className={`font-bold text-sm ${newCompany.isHighlight ? 'text-purple-400' : 'text-gray-400'}`}>
                                                    Liberar Desconto no Site (Destaque VIP Roxo)
                                                </span>
                                            </div>
                                        </label>

                                        {newCompany.isHighlight && (
                                            <div className="animate-fade-in-up">
                                                <label className="text-xs text-purple-400 font-bold block mb-1">
                                                    Palavra-Chave / Código do Cupom <span className="text-red-500">*</span>
                                                </label>
                                                <input 
                                                    type="text" 
                                                    placeholder="Ex: SINALIZA10, VIP2024"
                                                    className="w-full bg-neutral-900 border border-purple-500/50 text-white px-3 py-2 rounded focus:border-purple-500 focus:outline-none"
                                                    value={newCompany.couponCode}
                                                    onChange={(e) => setNewCompany({...newCompany, couponCode: e.target.value.toUpperCase()})}
                                                />
                                                <p className="text-[10px] text-gray-500 mt-1">
                                                    O cliente verá este código ao clicar em "Desconto".
                                                </p>
                                            </div>
                                        )}
                                    </div>

                                    <div className="col-span-2 flex justify-end">
                                        <button 
                                            type="submit"
                                            className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded-lg transition-colors flex items-center gap-2"
                                        >
                                            <Check size={18} /> Salvar Empresa
                                        </button>
                                    </div>
                                </form>
                            </div>

                            {/* List of Companies */}
                            <div className="flex-1 overflow-auto bg-neutral-900 rounded-lg border border-neutral-800 custom-scrollbar">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="bg-neutral-800 text-gray-400 text-sm uppercase">
                                            <th className="p-4 border-b border-neutral-700">Empresa</th>
                                            <th className="p-4 border-b border-neutral-700">Oferta</th>
                                            <th className="p-4 border-b border-neutral-700">Status</th>
                                            <th className="p-4 border-b border-neutral-700 text-right">Ação</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {companies.map((company) => (
                                            <tr key={company.id} className="border-b border-neutral-800 hover:bg-neutral-800/50">
                                                <td className="p-4">
                                                    <p className="font-bold text-white">{company.name}</p>
                                                    <p className="text-xs text-gray-500">{company.address}</p>
                                                </td>
                                                <td className="p-4 text-gray-300">
                                                    {company.productName} <br/>
                                                    <span className="text-xs text-green-500">
                                                        {company.offerType === 'fixed_price' ? company.vipPrice : company.discountLabel}
                                                    </span>
                                                </td>
                                                <td className="p-4">
                                                    {company.isHighlight ? (
                                                        <span className="inline-flex items-center gap-1 bg-purple-900/30 text-purple-400 border border-purple-500/30 px-2 py-1 rounded text-xs">
                                                            <Zap size={10} /> Liberado: {company.couponCode || 'Sem código'}
                                                        </span>
                                                    ) : (
                                                        <span className="text-xs text-gray-500">Padrão</span>
                                                    )}
                                                </td>
                                                <td className="p-4 text-right">
                                                    <button 
                                                        onClick={() => removeCompany(company.id)}
                                                        className="text-red-500 hover:text-red-400 p-2 hover:bg-neutral-800 rounded transition-colors"
                                                        title="Remover"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {activeTab === 'site_editor' && (
                        <div className="flex flex-col h-full gap-6 overflow-y-auto custom-scrollbar pr-2">
                             
                             {/* Payment Settings - NEW */}
                             <div className="bg-neutral-900/50 p-6 rounded-xl border border-neutral-800">
                                <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2 border-b border-neutral-800 pb-2">
                                    <CreditCard size={20} className="text-green-500" />
                                    Configurações de Pagamento
                                </h3>
                                <div className="space-y-4">
                                    <label className="flex items-center gap-3 cursor-pointer p-4 bg-neutral-800 rounded-lg border border-neutral-700">
                                        <div className="relative">
                                            <input 
                                                type="checkbox" 
                                                className="peer sr-only"
                                                checked={editConfig.requireReceiptUpload}
                                                onChange={(e) => setEditConfig({...editConfig, requireReceiptUpload: e.target.checked})}
                                            />
                                            <div className="w-10 h-6 bg-neutral-700 rounded-full peer-checked:bg-green-600 transition-colors"></div>
                                            <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform peer-checked:translate-x-4"></div>
                                        </div>
                                        <div>
                                            <span className="font-bold text-sm text-white block">Exigir Upload de Comprovante (Print)</span>
                                            <span className="text-xs text-gray-400">Se desativado, o cliente apenas confirma o pagamento sem enviar arquivo.</span>
                                        </div>
                                    </label>
                                </div>
                             </div>

                             {/* Global Images */}
                             <div className="bg-neutral-900/50 p-6 rounded-xl border border-neutral-800">
                                <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2 border-b border-neutral-800 pb-2">
                                    <Image size={20} className="text-red-500" />
                                    Imagens e Textos Globais
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div className="col-span-1">
                                        {renderImageInput(
                                            "Imagem Fundo (Hero)", 
                                            editConfig.hero.backgroundImage, 
                                            (val) => setEditConfig({...editConfig, hero: {...editConfig.hero, backgroundImage: val}})
                                        )}
                                    </div>
                                    <div className="col-span-1">
                                        {renderImageInput(
                                            "Imagem Destaque da Semana", 
                                            editConfig.featured.image, 
                                            (val) => setEditConfig({...editConfig, featured: {...editConfig.featured, image: val}})
                                        )}
                                    </div>
                                    <div className="col-span-1">
                                        {renderImageInput(
                                            "Imagem Fundo Final (CTA)", 
                                            editConfig.finalCta.image, 
                                            (val) => setEditConfig({...editConfig, finalCta: {...editConfig.finalCta, image: val}})
                                        )}
                                    </div>
                                </div>
                             </div>

                             {/* Featured Business Content Editor */}
                             <div className="bg-neutral-900/50 p-6 rounded-xl border border-neutral-800">
                                <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2 border-b border-neutral-800 pb-2">
                                    <Star size={20} className="text-yellow-500" />
                                    Conteúdo do Destaque da Semana
                                </h3>
                                <div className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="text-xs text-gray-400 font-bold block mb-1">Badge Superior (Ex: Destaque)</label>
                                            <input 
                                                type="text" 
                                                className="w-full bg-neutral-800 border border-neutral-700 text-white px-3 py-2 rounded focus:border-red-500 focus:outline-none"
                                                value={editConfig.featured.badgeText}
                                                onChange={(e) => setEditConfig({...editConfig, featured: {...editConfig.featured, badgeText: e.target.value}})}
                                            />
                                        </div>
                                        <div>
                                            <label className="text-xs text-gray-400 font-bold block mb-1">Texto Promoção (Ex: Pague 1 Leve 2)</label>
                                            <input 
                                                type="text" 
                                                className="w-full bg-neutral-800 border border-neutral-700 text-white px-3 py-2 rounded focus:border-red-500 focus:outline-none"
                                                value={editConfig.featured.promoLabel}
                                                onChange={(e) => setEditConfig({...editConfig, featured: {...editConfig.featured, promoLabel: e.target.value}})}
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="text-xs text-gray-400 font-bold block mb-1">Descrição do Restaurante Destaque</label>
                                        <textarea 
                                            className="w-full bg-neutral-800 border border-neutral-700 text-white px-3 py-2 rounded focus:border-red-500 focus:outline-none"
                                            rows={3}
                                            value={editConfig.featured.description}
                                            onChange={(e) => setEditConfig({...editConfig, featured: {...editConfig.featured, description: e.target.value}})}
                                        />
                                    </div>
                                </div>
                             </div>

                             {/* Nature Spots Editor */}
                             <div className="bg-neutral-900/50 p-6 rounded-xl border border-neutral-800">
                                <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2 border-b border-neutral-800 pb-2">
                                    <MapPin size={20} className="text-red-500" />
                                    Gerenciador de Natureza (6 Itens)
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {editConfig.natureSpots.map((spot, index) => (
                                        <div key={index} className="bg-neutral-800/50 p-4 rounded-lg border border-neutral-700">
                                            <div className="flex justify-between items-center mb-3">
                                                <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                                                    Card #{index + 1} ({index < 2 ? 'Trilha' : index < 4 ? 'Águas' : 'Praia'})
                                                </span>
                                            </div>
                                            <div className="space-y-4">
                                                <div>
                                                    <label className="text-[10px] text-gray-500 font-bold block mb-1">Nome do Local</label>
                                                    <input 
                                                        type="text" 
                                                        className="w-full bg-neutral-900 border border-neutral-800 text-white px-2 py-1.5 rounded text-sm focus:border-red-500 focus:outline-none"
                                                        value={spot.name}
                                                        onChange={(e) => {
                                                            const newSpots = [...editConfig.natureSpots];
                                                            newSpots[index] = { ...spot, name: e.target.value };
                                                            setEditConfig({...editConfig, natureSpots: newSpots});
                                                        }}
                                                    />
                                                </div>
                                                <div>
                                                    <label className="text-[10px] text-gray-500 font-bold block mb-1">Detalhe de Acesso / Distância</label>
                                                    <input 
                                                        type="text" 
                                                        className="w-full bg-neutral-900 border border-neutral-800 text-white px-2 py-1.5 rounded text-sm focus:border-red-500 focus:outline-none"
                                                        value={spot.distance}
                                                        onChange={(e) => {
                                                            const newSpots = [...editConfig.natureSpots];
                                                            newSpots[index] = { ...spot, distance: e.target.value };
                                                            setEditConfig({...editConfig, natureSpots: newSpots});
                                                        }}
                                                    />
                                                </div>
                                                <div>
                                                    <label className="text-[10px] text-gray-500 font-bold block mb-1">Descrição Completa (VIP)</label>
                                                    <textarea 
                                                        className="w-full bg-neutral-900 border border-neutral-800 text-white px-2 py-1.5 rounded text-sm focus:border-red-500 focus:outline-none"
                                                        rows={2}
                                                        value={spot.description || ''}
                                                        onChange={(e) => {
                                                            const newSpots = [...editConfig.natureSpots];
                                                            newSpots[index] = { ...spot, description: e.target.value };
                                                            setEditConfig({...editConfig, natureSpots: newSpots});
                                                        }}
                                                    />
                                                </div>
                                                <div>
                                                    {renderImageInput(
                                                        "Imagem do Local",
                                                        spot.image,
                                                        (val) => {
                                                            const newSpots = [...editConfig.natureSpots];
                                                            newSpots[index] = { ...spot, image: val };
                                                            setEditConfig({...editConfig, natureSpots: newSpots});
                                                        }
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                             </div>

                             {/* Testimonials Editor */}
                             <div className="bg-neutral-900/50 p-6 rounded-xl border border-neutral-800">
                                <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2 border-b border-neutral-800 pb-2">
                                    <Users size={20} className="text-red-500" />
                                    Gerenciador de Depoimentos (3 Itens)
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    {editConfig.testimonials.map((testim, index) => (
                                        <div key={index} className="bg-neutral-800/50 p-4 rounded-lg border border-neutral-700">
                                            <div className="mb-3">
                                                <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                                                    Depoimento #{index + 1}
                                                </span>
                                            </div>
                                            <div className="space-y-4">
                                                <div>
                                                    <label className="text-[10px] text-gray-500 font-bold block mb-1">Nome</label>
                                                    <input 
                                                        type="text" 
                                                        className="w-full bg-neutral-900 border border-neutral-800 text-white px-2 py-1.5 rounded text-sm focus:border-red-500 focus:outline-none"
                                                        value={testim.name}
                                                        onChange={(e) => {
                                                            const newTestimonials = [...editConfig.testimonials];
                                                            newTestimonials[index] = { ...testim, name: e.target.value };
                                                            setEditConfig({...editConfig, testimonials: newTestimonials});
                                                        }}
                                                    />
                                                </div>
                                                <div>
                                                    <label className="text-[10px] text-gray-500 font-bold block mb-1">Função / Local</label>
                                                    <input 
                                                        type="text" 
                                                        className="w-full bg-neutral-900 border border-neutral-800 text-white px-2 py-1.5 rounded text-sm focus:border-red-500 focus:outline-none"
                                                        value={testim.role}
                                                        onChange={(e) => {
                                                            const newTestimonials = [...editConfig.testimonials];
                                                            newTestimonials[index] = { ...testim, role: e.target.value };
                                                            setEditConfig({...editConfig, testimonials: newTestimonials});
                                                        }}
                                                    />
                                                </div>
                                                <div>
                                                    <label className="text-[10px] text-gray-500 font-bold block mb-1">Texto do Depoimento</label>
                                                    <textarea 
                                                        className="w-full bg-neutral-900 border border-neutral-800 text-white px-2 py-1.5 rounded text-xs focus:border-red-500 focus:outline-none"
                                                        rows={3}
                                                        value={testim.text}
                                                        onChange={(e) => {
                                                            const newTestimonials = [...editConfig.testimonials];
                                                            newTestimonials[index] = { ...testim, text: e.target.value };
                                                            setEditConfig({...editConfig, testimonials: newTestimonials});
                                                        }}
                                                    />
                                                </div>
                                                <div>
                                                    {renderImageInput(
                                                        "Foto do Cliente",
                                                        testim.image,
                                                        (val) => {
                                                            const newTestimonials = [...editConfig.testimonials];
                                                            newTestimonials[index] = { ...testim, image: val };
                                                            setEditConfig({...editConfig, testimonials: newTestimonials});
                                                        }
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                             </div>

                             <div className="bg-neutral-900/50 p-6 rounded-xl border border-neutral-800">
                                <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2 border-b border-neutral-800 pb-2">
                                    <Layout size={20} className="text-red-500" />
                                    Textos Principais
                                </h3>
                                <div className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="text-xs text-gray-400 font-bold block mb-1">Título Prefixo</label>
                                            <input 
                                                type="text" 
                                                className="w-full bg-neutral-800 border border-neutral-700 text-white px-3 py-2 rounded focus:border-red-500 focus:outline-none"
                                                value={editConfig.hero.titlePrefix}
                                                onChange={(e) => setEditConfig({...editConfig, hero: {...editConfig.hero, titlePrefix: e.target.value}})}
                                            />
                                        </div>
                                        <div>
                                            <label className="text-xs text-gray-400 font-bold block mb-1">Título Sufixo (Colorido)</label>
                                            <input 
                                                type="text" 
                                                className="w-full bg-neutral-800 border border-neutral-700 text-white px-3 py-2 rounded focus:border-red-500 focus:outline-none"
                                                value={editConfig.hero.titleSuffix}
                                                onChange={(e) => setEditConfig({...editConfig, hero: {...editConfig.hero, titleSuffix: e.target.value}})}
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="text-xs text-gray-400 font-bold block mb-1">Subtítulo</label>
                                        <input 
                                            type="text" 
                                            className="w-full bg-neutral-800 border border-neutral-700 text-white px-3 py-2 rounded focus:border-red-500 focus:outline-none"
                                            value={editConfig.hero.subtitle}
                                            onChange={(e) => setEditConfig({...editConfig, hero: {...editConfig.hero, subtitle: e.target.value}})}
                                        />
                                    </div>
                                    <div>
                                        <label className="text-xs text-gray-400 font-bold block mb-1">Descrição</label>
                                        <textarea 
                                            className="w-full bg-neutral-800 border border-neutral-700 text-white px-3 py-2 rounded focus:border-red-500 focus:outline-none"
                                            rows={2}
                                            value={editConfig.hero.description}
                                            onChange={(e) => setEditConfig({...editConfig, hero: {...editConfig.hero, description: e.target.value}})}
                                        />
                                    </div>
                                </div>
                             </div>

                             <div className="bg-neutral-900/50 p-6 rounded-xl border border-neutral-800">
                                <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2 border-b border-neutral-800 pb-2">
                                    <Tag size={20} className="text-red-500" />
                                    Títulos das Seções
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-xs text-gray-400 font-bold block mb-1">Título - Destaque</label>
                                        <input 
                                            type="text" 
                                            className="w-full bg-neutral-800 border border-neutral-700 text-white px-3 py-2 rounded focus:border-red-500 focus:outline-none"
                                            value={editConfig.sectionTitles.featured}
                                            onChange={(e) => setEditConfig({...editConfig, sectionTitles: {...editConfig.sectionTitles, featured: e.target.value}})}
                                        />
                                    </div>
                                    <div>
                                        <label className="text-xs text-gray-400 font-bold block mb-1">Título - Descontos</label>
                                        <input 
                                            type="text" 
                                            className="w-full bg-neutral-800 border border-neutral-700 text-white px-3 py-2 rounded focus:border-red-500 focus:outline-none"
                                            value={editConfig.sectionTitles.discounts}
                                            onChange={(e) => setEditConfig({...editConfig, sectionTitles: {...editConfig.sectionTitles, discounts: e.target.value}})}
                                        />
                                    </div>
                                    <div>
                                        <label className="text-xs text-gray-400 font-bold block mb-1">Título - VIP</label>
                                        <input 
                                            type="text" 
                                            className="w-full bg-neutral-800 border border-neutral-700 text-white px-3 py-2 rounded focus:border-red-500 focus:outline-none"
                                            value={editConfig.sectionTitles.vip}
                                            onChange={(e) => setEditConfig({...editConfig, sectionTitles: {...editConfig.sectionTitles, vip: e.target.value}})}
                                        />
                                    </div>
                                    <div>
                                        <label className="text-xs text-gray-400 font-bold block mb-1">Título - Natureza</label>
                                        <input 
                                            type="text" 
                                            className="w-full bg-neutral-800 border border-neutral-700 text-white px-3 py-2 rounded focus:border-red-500 focus:outline-none"
                                            value={editConfig.sectionTitles.nature}
                                            onChange={(e) => setEditConfig({...editConfig, sectionTitles: {...editConfig.sectionTitles, nature: e.target.value}})}
                                        />
                                    </div>
                                </div>
                             </div>

                             <div className="bg-neutral-900/50 p-6 rounded-xl border border-neutral-800 mb-6">
                                <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2 border-b border-neutral-800 pb-2">
                                    <MessageSquare size={20} className="text-red-500" />
                                    Rodapé e Contatos
                                </h3>
                                <div className="space-y-4">
                                    <div>
                                        <label className="text-xs text-gray-400 font-bold block mb-1">Descrição Curta</label>
                                        <textarea 
                                            className="w-full bg-neutral-800 border border-neutral-700 text-white px-3 py-2 rounded focus:border-red-500 focus:outline-none"
                                            rows={2}
                                            value={editConfig.footer.description}
                                            onChange={(e) => setEditConfig({...editConfig, footer: {...editConfig.footer, description: e.target.value}})}
                                        />
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="text-xs text-gray-400 font-bold block mb-1">WhatsApp de Contato</label>
                                            <input 
                                                type="text" 
                                                className="w-full bg-neutral-800 border border-neutral-700 text-white px-3 py-2 rounded focus:border-red-500 focus:outline-none"
                                                value={editConfig.footer.whatsapp}
                                                onChange={(e) => setEditConfig({...editConfig, footer: {...editConfig.footer, whatsapp: e.target.value}})}
                                            />
                                        </div>
                                        <div>
                                            <label className="text-xs text-gray-400 font-bold block mb-1">Email de Contato</label>
                                            <input 
                                                type="text" 
                                                className="w-full bg-neutral-800 border border-neutral-700 text-white px-3 py-2 rounded focus:border-red-500 focus:outline-none"
                                                value={editConfig.footer.email}
                                                onChange={(e) => setEditConfig({...editConfig, footer: {...editConfig.footer, email: e.target.value}})}
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="text-xs text-gray-400 font-bold block mb-1">URL Instagram</label>
                                        <input 
                                            type="text" 
                                            className="w-full bg-neutral-800 border border-neutral-700 text-white px-3 py-2 rounded focus:border-red-500 focus:outline-none"
                                            value={editConfig.footer.instagramUrl}
                                            onChange={(e) => setEditConfig({...editConfig, footer: {...editConfig.footer, instagramUrl: e.target.value}})}
                                        />
                                    </div>
                                </div>
                             </div>

                             <div className="flex justify-end pt-4">
                                <button 
                                    onClick={handleSaveSiteConfig}
                                    className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-8 rounded-lg shadow-lg flex items-center gap-2 transition-all hover:scale-105"
                                >
                                    <Check size={20} /> Salvar Alterações do Site
                                </button>
                             </div>
                        </div>
                    )}
                </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
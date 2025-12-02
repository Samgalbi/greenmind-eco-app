import React, { useState } from 'react';
import {
    Users, BarChart3, Settings, FileText, AlertTriangle,
    CheckCircle, XCircle, Eye, Edit, Trash2, Plus, Search, Filter, Download,
    Calendar, Clock, Globe, Mail, Bell, Activity, Database, Zap,
    Target, Award, MessageSquare, HelpCircle, RefreshCw, ExternalLink,
    PieChart, LineChart, BarChart, Monitor, Smartphone, Tablet, MapPin,
    Flag, Star, Heart, Share2, Bookmark, DollarSign, Percent, TrendingDown,
    UserCheck, UserX, UserPlus, Wifi, WifiOff, Lock, Unlock, Ban, CheckSquare
} from 'lucide-react';
import { missionApi, quizApi, tipsApi, userApi, Mission, Quiz, Tip, User } from '../services/api';
import { useApi } from '../hooks/useApi';

type ContentType = 'missions' | 'quizzes' | 'tips';

const AdminDashboard: React.FC = () => {
    const [activeAdminTab, setActiveAdminTab] = useState('overview');
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');
    const [realTimeUpdates, setRealTimeUpdates] = useState(true);

    // Gestion de l'onglet contenu
    const [activeContentType, setActiveContentType] = useState<ContentType>('missions');
    const [editingContentId, setEditingContentId] = useState<number | null>(null);
    const [contentForm, setContentForm] = useState<any>({});
    const [contentReloadKey, setContentReloadKey] = useState(0);

    // Gestion des utilisateurs (CRUD)
    const [editingUserId, setEditingUserId] = useState<number | null>(null);
    const [userForm, setUserForm] = useState<{ name: string; email: string }>({
        name: '',
        email: '',
    });
    const [usersReloadKey, setUsersReloadKey] = useState(0);

    const { data: usersFromApi } = useApi<User[]>(() => userApi.getAll(), [usersReloadKey]);

    // Mock data
    const adminStats = {
        totalUsers: 1247,
        activeUsers: 892,
        totalCO2Reduced: 125470,
        totalPoints: 458900,
        newUsersThisMonth: 89,
        averagePointsPerUser: 368,
        totalQuizzes: 45,
        totalMissions: 32,
        totalTips: 128,
        serverUptime: 99.8,
        dailyActiveUsers: 234,
        weeklyActiveUsers: 567,
        monthlyActiveUsers: 892,
        conversionRate: 12.5,
        averageSessionTime: 8.5,
        bounceRate: 23.4,
        recentSignups: 23,
        suspendedUsers: 12
    };

    const users = (usersFromApi || []).map((u) => ({
        ...u,
        // Valeurs par défaut pour les colonnes d'activité
        joinDate: u.createdAt,
        lastActive: u.createdAt,
        status: 'active',
        role: 'user',
        location: '—',
        device: '—',
        completedQuizzes: 0,
        completedMissions: 0,
    }));

    const securityLogs = [
        {
            id: 1,
            type: 'failed_login',
            description: 'Tentative de connexion échouée',
            user: 'unknown@email.com',
            ip: '192.168.1.100',
            timestamp: '2024-11-26T10:30:00Z',
            severity: 'medium'
        },
        {
            id: 2,
            type: 'suspicious_activity',
            description: 'Activité suspecte détectée',
            user: 'test.user@email.com',
            ip: '10.0.0.50',
            timestamp: '2024-11-26T09:15:00Z',
            severity: 'high'
        },
        {
            id: 3,
            type: 'failed_login',
            description: 'Multiples tentatives de connexion',
            user: 'admin@test.com',
            ip: '172.16.0.25',
            timestamp: '2024-11-26T08:45:00Z',
            severity: 'high'
        }
    ];

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'active': return 'bg-green-50 text-green-700 border-green-200';
            case 'inactive': return 'bg-gray-50 text-gray-700 border-gray-200';
            case 'suspended': return 'bg-red-50 text-red-700 border-red-200';
            default: return 'bg-gray-50 text-gray-700 border-gray-200';
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'active': return <CheckCircle className="w-3 h-3" />;
            case 'inactive': return <Clock className="w-3 h-3" />;
            case 'suspended': return <XCircle className="w-3 h-3" />;
            default: return <Clock className="w-3 h-3" />;
        }
    };

    const filteredUsers = users.filter(user => {
        const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            user.email.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesFilter = filterStatus === 'all' || user.status === filterStatus;
        return matchesSearch && matchesFilter;
    });

    // Chargement du contenu selon le type sélectionné
    const { data: missions } = useApi<Mission[]>(() => missionApi.getAllMissions(), [activeContentType === 'missions', contentReloadKey]);
    const { data: quizzes } = useApi<Quiz[]>(() => quizApi.getAllQuizzes(), [activeContentType === 'quizzes', contentReloadKey]);
    const { data: tips } = useApi<Tip[]>(() => tipsApi.getAllTips(), [activeContentType === 'tips', contentReloadKey]);

    const handleContentEdit = (type: ContentType, item: Mission | Quiz | Tip) => {
        setActiveContentType(type);
        setEditingContentId(item.id);
        setContentForm(item);
    };

    const resetContentForm = () => {
        setEditingContentId(null);
        setContentForm({});
    };

    const handleContentSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (activeContentType === 'missions') {
                if (editingContentId) {
                    await missionApi.updateMission(editingContentId, contentForm);
                } else {
                    await missionApi.createMission(contentForm);
                }
            } else if (activeContentType === 'quizzes') {
                if (editingContentId) {
                    await quizApi.updateQuiz(editingContentId, contentForm);
                } else {
                    await quizApi.createQuiz(contentForm);
                }
            } else if (activeContentType === 'tips') {
                if (editingContentId) {
                    await tipsApi.updateTip(editingContentId, contentForm);
                } else {
                    await tipsApi.createTip(contentForm);
                }
            }
            resetContentForm();
            setContentReloadKey((k) => k + 1);
        } catch (error) {
            console.error('Erreur lors de la sauvegarde du contenu', error);
        }
    };

    const handleContentDelete = async (type: ContentType, id: number) => {
        if (!window.confirm('Confirmer la suppression ?')) return;
        try {
            if (type === 'missions') {
                await missionApi.deleteMission(id);
            } else if (type === 'quizzes') {
                await quizApi.deleteQuiz(id);
            } else if (type === 'tips') {
                await tipsApi.deleteTip(id);
            }
            setContentReloadKey((k) => k + 1);
        } catch (error) {
            console.error('Erreur lors de la suppression', error);
        }
    };

    const handleUserEdit = (user: any) => {
        setEditingUserId(user.id);
        setUserForm({ name: user.name, email: user.email });
    };

    const resetUserForm = () => {
        setEditingUserId(null);
        setUserForm({ name: '', email: '' });
    };

    const handleUserSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (editingUserId) {
                await userApi.update(editingUserId, userForm);
            } else {
                await userApi.create(userForm);
            }
            resetUserForm();
            setUsersReloadKey((k) => k + 1);
        } catch (error) {
            console.error('Erreur lors de la sauvegarde de l’utilisateur', error);
        }
    };

    const handleUserDelete = async (id: number) => {
        if (!window.confirm('Confirmer la suppression de cet utilisateur ?')) return;
        try {
            await userApi.delete(id);
            setUsersReloadKey((k) => k + 1);
        } catch (error) {
            console.error('Erreur lors de la suppression de l’utilisateur', error);
        }
    };

    const adminTabs = [
        { id: 'overview', label: 'Vue d\'ensemble', icon: BarChart3 },
        { id: 'users', label: 'Utilisateurs', icon: Users },
        { id: 'content', label: 'Contenu', icon: FileText },
        { id: 'settings', label: 'Paramètres', icon: Settings },
    ];

    return (
        <div className="space-y-6">
            {/* Admin Navigation */}
            <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
                <div className="flex flex-wrap gap-2">
                    {adminTabs.map((tab) => {
                        const Icon = tab.icon;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveAdminTab(tab.id)}
                                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors text-sm font-medium ${
                                    activeAdminTab === tab.id
                                        ? 'bg-blue-50 text-blue-700 border border-blue-200'
                                        : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
                                }`}
                            >
                                <Icon className="w-4 h-4" />
                                {tab.label}
                            </button>
                        );
                    })}
                </div>
            </div>

            <div className="space-y-6">
                {/* Overview Tab */}
                {activeAdminTab === 'overview' && (
                    <div className="space-y-6">
                        {/* Key Metrics */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-gray-600">Utilisateurs Totaux</p>
                                        <p className="text-2xl font-bold text-gray-900">{adminStats.totalUsers.toLocaleString()}</p>
                                        <p className="text-xs text-green-600 mt-1">+{adminStats.newUsersThisMonth} ce mois</p>
                                    </div>
                                    <div className="bg-blue-100 p-3 rounded-lg">
                                        <Users className="w-6 h-6 text-blue-600" />
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-gray-600">Utilisateurs Actifs</p>
                                        <p className="text-2xl font-bold text-gray-900">{adminStats.activeUsers.toLocaleString()}</p>
                                        <p className="text-xs text-green-600 mt-1">{((adminStats.activeUsers / adminStats.totalUsers) * 100).toFixed(1)}% du total</p>
                                    </div>
                                    <div className="bg-green-100 p-3 rounded-lg">
                                        <Activity className="w-6 h-6 text-green-600" />
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-gray-600">CO₂ Total Réduit</p>
                                        <p className="text-2xl font-bold text-gray-900">{adminStats.totalCO2Reduced.toLocaleString()} kg</p>
                                        <p className="text-xs text-green-600 mt-1">Impact environnemental</p>
                                    </div>
                                    <div className="bg-emerald-100 p-3 rounded-lg">
                                        <Globe className="w-6 h-6 text-emerald-600" />
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-gray-600">Points Totaux</p>
                                        <p className="text-2xl font-bold text-gray-900">{adminStats.totalPoints.toLocaleString()}</p>
                                        <p className="text-xs text-blue-600 mt-1">Moyenne: {adminStats.averagePointsPerUser} pts/user</p>
                                    </div>
                                    <div className="bg-purple-100 p-3 rounded-lg">
                                        <Award className="w-6 h-6 text-purple-600" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Quick Actions */}
                        <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Actions Rapides</h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <button className="flex items-center gap-3 p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
                                    <Plus className="w-5 h-5 text-blue-600" />
                                    <span className="text-sm font-medium text-blue-700">Ajouter un Quiz</span>
                                </button>
                                <button className="flex items-center gap-3 p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors">
                                    <Target className="w-5 h-5 text-green-600" />
                                    <span className="text-sm font-medium text-green-700">Créer une Mission</span>
                                </button>
                                <button className="flex items-center gap-3 p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors">
                                    <MessageSquare className="w-5 h-5 text-purple-600" />
                                    <span className="text-sm font-medium text-purple-700">Envoyer une Notification</span>
                                </button>
                            </div>
                        </div>

                        {/* Recent Activity */}
                        <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Activité Récente</h3>
                            <div className="space-y-3">
                                <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                                    <div className="bg-green-100 p-2 rounded-full">
                                        <UserPlus className="w-4 h-4 text-green-600" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm font-medium text-gray-900">Nouvel utilisateur inscrit</p>
                                        <p className="text-xs text-gray-500">emma.rousseau@email.com - Il y a 2 heures</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                                    <div className="bg-blue-100 p-2 rounded-full">
                                        <CheckCircle className="w-4 h-4 text-blue-600" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm font-medium text-gray-900">Quiz complété</p>
                                        <p className="text-xs text-gray-500">thomas.moreau@email.com - Il y a 3 heures</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                                    <div className="bg-purple-100 p-2 rounded-full">
                                        <Target className="w-4 h-4 text-purple-600" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm font-medium text-gray-900">Mission accomplie</p>
                                        <p className="text-xs text-gray-500">marie.dubois@email.com - Il y a 5 heures</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Users Management Tab */}
                {activeAdminTab === 'users' && (
                    <div className="space-y-6">
                        {/* Formulaire de création / édition utilisateur */}
                        <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">
                                {editingUserId ? 'Modifier un utilisateur' : 'Créer un utilisateur'}
                            </h3>
                            <form onSubmit={handleUserSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Nom</label>
                                    <input
                                        type="text"
                                        value={userForm.name}
                                        onChange={(e) => setUserForm({ ...userForm, name: e.target.value })}
                                        required
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                    <input
                                        type="email"
                                        value={userForm.email}
                                        onChange={(e) => setUserForm({ ...userForm, email: e.target.value })}
                                        required
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    />
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        type="submit"
                                        className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                                    >
                                        <CheckCircle className="w-4 h-4" />
                                        {editingUserId ? 'Mettre à jour' : 'Créer'}
                                    </button>
                                    {editingUserId && (
                                        <button
                                            type="button"
                                            onClick={resetUserForm}
                                            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                                        >
                                            Annuler
                                        </button>
                                    )}
                                </div>
                            </form>
                        </div>

                        {/* Search and Filter */}
                        <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
                            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                                <div className="flex-1 max-w-md">
                                    <div className="relative">
                                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                        <input
                                            type="text"
                                            placeholder="Rechercher un utilisateur..."
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        />
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <select
                                        value={filterStatus}
                                        onChange={(e) => setFilterStatus(e.target.value)}
                                        className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    >
                                        <option value="all">Tous les statuts</option>
                                        <option value="active">Actifs</option>
                                        <option value="inactive">Inactifs</option>
                                        <option value="suspended">Suspendus</option>
                                    </select>
                                    <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                                        <Download className="w-4 h-4" />
                                        Exporter
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Users Table */}
                        <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
                            <div className="px-6 py-4 border-b border-gray-200">
                                <h3 className="text-lg font-semibold text-gray-900">
                                    Gestion des Utilisateurs ({filteredUsers.length})
                                </h3>
                            </div>
                            <div className="overflow-x-auto">
                                <div className="inline-block min-w-full align-middle">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Utilisateur
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Activité
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Statut
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Actions
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {filteredUsers.map((user) => (
                                                <tr key={user.id} className="hover:bg-gray-50">
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="flex items-center">
                                                            <div className="flex-shrink-0 h-10 w-10">
                                                                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-green-400 to-blue-500 flex items-center justify-center">
                                                                    <span className="text-sm font-medium text-white">
                                                                        {user.name.split(' ').map(n => n[0]).join('')}
                                                                    </span>
                                                                </div>
                                                            </div>
                                                            <div className="ml-4">
                                                                <div className="text-sm font-medium text-gray-900">{user.name}</div>
                                                                <div className="text-sm text-gray-500">{user.email}</div>
                                                                {user.joinDate && (
                                                                    <div className="text-xs text-gray-400 mt-1">
                                                                        Inscrit le {new Date(user.joinDate).toLocaleDateString('fr-FR')}
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div>
                                                            <div className="flex items-center gap-2 mb-1">
                                                                <Award className="w-4 h-4 text-yellow-500" />
                                                                <span className="text-sm font-medium text-gray-900">{user.points} pts</span>
                                                            </div>
                                                            <div className="text-xs text-gray-500 mt-1">
                                                                {user.completedQuizzes} quiz • {user.completedMissions} missions
                                                            </div>
                                                            <div className="text-xs text-green-600 mt-1">
                                                                {user.co2Reduced} kg CO₂ réduit
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(user.status)}`}>
                                                            {getStatusIcon(user.status)}
                                                            {user.status === 'active' ? 'Actif' : user.status === 'inactive' ? 'Inactif' : 'Suspendu'}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                        <div className="flex items-center gap-2">
                                                            <button className="text-blue-600 hover:text-blue-900 p-1 rounded" title="Voir détails">
                                                                <Eye className="w-4 h-4" />
                                                            </button>
                                                            <button
                                                                className="text-green-600 hover:text-green-900 p-1 rounded"
                                                                title="Modifier"
                                                                onClick={() => handleUserEdit(user)}
                                                            >
                                                                <Edit className="w-4 h-4" />
                                                            </button>
                                                            <button
                                                                className="text-red-600 hover:text-red-900 p-1 rounded"
                                                                title="Supprimer"
                                                                onClick={() => handleUserDelete(user.id)}
                                                            >
                                                                <Trash2 className="w-4 h-4" />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                )}      
          {/* Content Management Tab */}
                {activeAdminTab === 'content' && (
                    <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-gray-900">Gestion du Contenu</h3>
                            <div className="inline-flex rounded-lg border border-gray-200 bg-gray-50 p-1">
                                <button
                                    type="button"
                                    onClick={() => { setActiveContentType('missions'); resetContentForm(); }}
                                    className={`px-3 py-1 text-xs font-medium rounded-md flex items-center gap-1 ${
                                        activeContentType === 'missions'
                                            ? 'bg-green-600 text-white'
                                            : 'text-gray-600 hover:bg-white'
                                    }`}
                                >
                                    <Target className="w-3 h-3" />
                                    Missions
                                </button>
                                <button
                                    type="button"
                                    onClick={() => { setActiveContentType('quizzes'); resetContentForm(); }}
                                    className={`px-3 py-1 text-xs font-medium rounded-md flex items-center gap-1 ${
                                        activeContentType === 'quizzes'
                                            ? 'bg-blue-600 text-white'
                                            : 'text-gray-600 hover:bg-white'
                                    }`}
                                >
                                    <HelpCircle className="w-3 h-3" />
                                    Quiz
                                </button>
                                <button
                                    type="button"
                                    onClick={() => { setActiveContentType('tips'); resetContentForm(); }}
                                    className={`px-3 py-1 text-xs font-medium rounded-md flex items-center gap-1 ${
                                        activeContentType === 'tips'
                                            ? 'bg-purple-600 text-white'
                                            : 'text-gray-600 hover:bg-white'
                                    }`}
                                >
                                    <Bookmark className="w-3 h-3" />
                                    Astuces éco
                                </button>
                            </div>
                        </div>

                        {/* Formulaire contenu */}
                        <form onSubmit={handleContentSubmit} className="mb-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            <div className="md:col-span-1">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Titre</label>
                                <input
                                    type="text"
                                    value={contentForm.title || ''}
                                    onChange={(e) => setContentForm({ ...contentForm, title: e.target.value })}
                                    required
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                            <div className="md:col-span-1">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    {activeContentType === 'tips' ? 'Contenu de l\'astuce' : 'Description'}
                                </label>
                                <textarea
                                    rows={2}
                                    value={
                                        activeContentType === 'tips'
                                            ? contentForm.content || ''
                                            : contentForm.description || ''
                                    }
                                    onChange={(e) => {
                                        const value = e.target.value;
                                        if (activeContentType === 'tips') {
                                            setContentForm({ ...contentForm, content: value });
                                        } else {
                                            setContentForm({ ...contentForm, description: value });
                                        }
                                    }}
                                    required
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                            <div className="space-y-2">
                                {activeContentType !== 'tips' && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Points</label>
                                        <input
                                            type="number"
                                            value={contentForm.points || ''}
                                            onChange={(e) =>
                                                setContentForm({ ...contentForm, points: Number(e.target.value) })
                                            }
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        />
                                    </div>
                                )}

                                {activeContentType === 'missions' && (
                                    <>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Catégorie</label>
                                            <input
                                                type="text"
                                                value={contentForm.category || ''}
                                                onChange={(e) =>
                                                    setContentForm({ ...contentForm, category: e.target.value })
                                                }
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            />
                                        </div>
                                        <div className="grid grid-cols-2 gap-2">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Durée</label>
                                                <input
                                                    type="text"
                                                    value={contentForm.duration || ''}
                                                    onChange={(e) =>
                                                        setContentForm({ ...contentForm, duration: e.target.value })
                                                    }
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Difficulté</label>
                                                <select
                                                    value={contentForm.difficulty || ''}
                                                    onChange={(e) =>
                                                        setContentForm({ ...contentForm, difficulty: e.target.value })
                                                    }
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                >
                                                    <option value="">Sélectionner</option>
                                                    <option value="Facile">Facile</option>
                                                    <option value="Moyen">Moyen</option>
                                                    <option value="Difficile">Difficile</option>
                                                </select>
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-2 gap-2">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Impact CO₂ (kg)</label>
                                                <input
                                                    type="number"
                                                    value={contentForm.co2Impact || ''}
                                                    onChange={(e) =>
                                                        setContentForm({
                                                            ...contentForm,
                                                            co2Impact: Number(e.target.value),
                                                        })
                                                    }
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Total (jours)</label>
                                                <input
                                                    type="number"
                                                    value={contentForm.total || ''}
                                                    onChange={(e) =>
                                                        setContentForm({
                                                            ...contentForm,
                                                            total: Number(e.target.value),
                                                        })
                                                    }
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                />
                                            </div>
                                        </div>
                                    </>
                                )}

                                {activeContentType === 'quizzes' && (
                                    <>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Difficulté</label>
                                            <select
                                                value={contentForm.difficulty || ''}
                                                onChange={(e) =>
                                                    setContentForm({ ...contentForm, difficulty: e.target.value })
                                                }
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            >
                                                <option value="">Sélectionner</option>
                                                <option value="Facile">Facile</option>
                                                <option value="Moyen">Moyen</option>
                                                <option value="Difficile">Difficile</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Impact CO₂ (kg)</label>
                                            <input
                                                type="number"
                                                value={contentForm.co2Impact || ''}
                                                onChange={(e) =>
                                                    setContentForm({
                                                        ...contentForm,
                                                        co2Impact: Number(e.target.value),
                                                    })
                                                }
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            />
                                        </div>
                                    </>
                                )}

                                {activeContentType === 'tips' && (
                                    <>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Catégorie</label>
                                            <input
                                                type="text"
                                                value={contentForm.category || ''}
                                                onChange={(e) =>
                                                    setContentForm({ ...contentForm, category: e.target.value })
                                                }
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Impact</label>
                                            <input
                                                type="text"
                                                value={contentForm.impact || ''}
                                                onChange={(e) =>
                                                    setContentForm({ ...contentForm, impact: e.target.value })
                                                }
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            />
                                        </div>
                                    </>
                                )}
                                <div className="flex gap-2 pt-1">
                                    <button
                                        type="submit"
                                        className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                                    >
                                        <CheckCircle className="w-4 h-4" />
                                        {editingContentId ? 'Mettre à jour' : 'Créer'}
                                    </button>
                                    {editingContentId && (
                                        <button
                                            type="button"
                                            onClick={resetContentForm}
                                            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                                        >
                                            Annuler
                                        </button>
                                    )}
                                </div>
                            </div>
                        </form>

                        {/* Liste contenu */}
                        <div className="border border-gray-200 rounded-lg overflow-hidden">
                            <table className="min-w-full divide-y divide-gray-200 text-sm">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-4 py-2 text-left font-medium text-gray-500 uppercase tracking-wider">
                                            Titre
                                        </th>
                                        <th className="px-4 py-2 text-left font-medium text-gray-500 uppercase tracking-wider">
                                            Type / Catégorie
                                        </th>
                                        <th className="px-4 py-2 text-left font-medium text-gray-500 uppercase tracking-wider">
                                            Points / Impact
                                        </th>
                                        <th className="px-4 py-2 text-left font-medium text-gray-500 uppercase tracking-wider">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {activeContentType === 'missions' &&
                                        (missions || []).map((mission) => (
                                            <tr key={mission.id} className="hover:bg-gray-50">
                                                <td className="px-4 py-2">{mission.title}</td>
                                                <td className="px-4 py-2">
                                                    Mission • {mission.category} • {mission.difficulty}
                                                </td>
                                                <td className="px-4 py-2">{mission.points} pts</td>
                                                <td className="px-4 py-2">
                                                    <div className="flex items-center gap-2">
                                                        <button
                                                            className="text-green-600 hover:text-green-900 p-1 rounded"
                                                            onClick={() => handleContentEdit('missions', mission)}
                                                        >
                                                            <Edit className="w-4 h-4" />
                                                        </button>
                                                        <button
                                                            className="text-red-600 hover:text-red-900 p-1 rounded"
                                                            onClick={() => handleContentDelete('missions', mission.id)}
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}

                                    {activeContentType === 'quizzes' &&
                                        (quizzes || []).map((quiz) => (
                                            <tr key={quiz.id} className="hover:bg-gray-50">
                                                <td className="px-4 py-2">{quiz.title}</td>
                                                <td className="px-4 py-2">Quiz • {quiz.difficulty}</td>
                                                <td className="px-4 py-2">{quiz.points} pts</td>
                                                <td className="px-4 py-2">
                                                    <div className="flex items-center gap-2">
                                                        <button
                                                            className="text-green-600 hover:text-green-900 p-1 rounded"
                                                            onClick={() => handleContentEdit('quizzes', quiz)}
                                                        >
                                                            <Edit className="w-4 h-4" />
                                                        </button>
                                                        <button
                                                            className="text-red-600 hover:text-red-900 p-1 rounded"
                                                            onClick={() => handleContentDelete('quizzes', quiz.id)}
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}

                                    {activeContentType === 'tips' &&
                                        (tips || []).map((tip) => (
                                            <tr key={tip.id} className="hover:bg-gray-50">
                                                <td className="px-4 py-2">{tip.title}</td>
                                                <td className="px-4 py-2">Astuce • {tip.category}</td>
                                                <td className="px-4 py-2">{tip.impact || '—'}</td>
                                                <td className="px-4 py-2">
                                                    <div className="flex items-center gap-2">
                                                        <button
                                                            className="text-green-600 hover:text-green-900 p-1 rounded"
                                                            onClick={() => handleContentEdit('tips', tip)}
                                                        >
                                                            <Edit className="w-4 h-4" />
                                                        </button>
                                                        <button
                                                            className="text-red-600 hover:text-red-900 p-1 rounded"
                                                            onClick={() => handleContentDelete('tips', tip.id)}
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}

                                    {((activeContentType === 'missions' && (!missions || missions.length === 0)) ||
                                        (activeContentType === 'quizzes' && (!quizzes || quizzes.length === 0)) ||
                                        (activeContentType === 'tips' && (!tips || tips.length === 0))) && (
                                        <tr>
                                            <td className="px-4 py-4 text-center text-sm text-gray-500" colSpan={4}>
                                                Aucun élément pour le moment. Créez-en un avec le formulaire ci-dessus.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* Settings Tab */}
                {activeAdminTab === 'settings' && (
                    <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
                        <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
                            <Settings className="w-5 h-5 text-gray-600" />
                            Paramètres de l'Application
                        </h3>
                        
                        <div className="space-y-8">
                            <div>
                                <h4 className="text-md font-semibold text-gray-900 mb-4">Paramètres Généraux</h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Points par Quiz Complété
                                        </label>
                                        <input
                                            type="number"
                                            defaultValue="50"
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Points par Mission Accomplie
                                        </label>
                                        <input
                                            type="number"
                                            defaultValue="100"
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div>
                                <h4 className="text-md font-semibold text-gray-900 mb-4">Paramètres de Contenu</h4>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Message de Bienvenue
                                    </label>
                                    <textarea
                                        rows={3}
                                        defaultValue="Bienvenue sur GreenMind ! Ensemble, agissons pour la planète et créons un avenir plus durable."
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    />
                                </div>
                            </div>

                            <div className="flex items-center gap-4 pt-6 border-t border-gray-200">
                                <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
                                    <CheckSquare className="w-4 h-4" />
                                    Sauvegarder les Paramètres
                                </button>
                                <button className="bg-gray-100 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-200 transition-colors">
                                    Annuler
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminDashboard;

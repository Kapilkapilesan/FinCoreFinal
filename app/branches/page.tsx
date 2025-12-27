'use client';

import React, { useState, useEffect } from 'react';
import { Plus, Search } from 'lucide-react';
import { Branch, BranchStats as BranchStatsType, BranchFormData } from '../../types/branch.types';
import { branchService } from '../../services/branch.service';
import { BranchStats } from '../../components/branches/BranchStats';
import { BranchTable } from '../../components/branches/BranchTable';
import { BranchForm } from '../../components/branches/BranchForm';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';
import { colors } from '../../themes/colors';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function BranchManagementPage() {
    const [branches, setBranches] = useState<Branch[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingBranch, setEditingBranch] = useState<Branch | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [branchToDelete, setBranchToDelete] = useState<number | null>(null);

    // Initial data fetch
    useEffect(() => {
        loadBranches();
    }, []);

    const loadBranches = async () => {
        try {
            setLoading(true);
            const data = await branchService.getBranches();
            setBranches(data);
        } catch (error) {
            console.error('Failed to load branches:', error);
            toast.error('Failed to load branches');
        } finally {
            setLoading(false);
        }
    };

    const handleAdd = () => {
        setEditingBranch(null);
        setShowModal(true);
    };

    const handleEdit = (branch: Branch) => {
        setEditingBranch(branch);
        setShowModal(true);
    };

    const handleDelete = (id: number) => {
        setBranchToDelete(id);
        setShowDeleteConfirm(true);
    };

    const confirmDelete = async () => {
        if (branchToDelete === null) return;

        try {
            await branchService.deleteBranch(branchToDelete);
            await loadBranches();
            toast.success('Branch deleted successfully!');
        } catch (error: any) {
            console.error('Failed to delete branch:', error);
            toast.error(error.message || 'Failed to delete branch');
        } finally {
            setBranchToDelete(null);
            setShowDeleteConfirm(false);
        }
    };

    const handleSave = async (formData: BranchFormData) => {
        try {
            if (editingBranch) {
                await branchService.updateBranch(editingBranch.id, formData);
                toast.success('Branch updated successfully!');
            } else {
                await branchService.createBranch(formData);
                toast.success('Branch created successfully!');
            }
            setShowModal(false);
            loadBranches();
        } catch (error: any) {
            console.error('Failed to save branch:', error);
            toast.error(error.message || 'Failed to save branch');
        }
    };

    const filteredBranches = branches.filter(branch =>
        (branch.branch_name ?? '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (branch.branch_id ?? '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (branch.location ?? '').toLowerCase().includes(searchTerm.toLowerCase())
    );

    const stats: BranchStatsType = {
        totalBranches: branches.length,
        activeBranches: branches.length,
        totalCustomers: 0,
        totalLoans: 0
    };

    if (loading && branches.length === 0) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6 p-6 max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Branch Management</h1>
                    <p className="text-sm text-gray-500 mt-1">Manage all branch locations and details</p>
                </div>
                <button
                    onClick={handleAdd}
                    className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
                    style={{ backgroundColor: colors.primary[600] }}
                >
                    <Plus className="w-4 h-4" />
                    <span className="text-sm font-medium">Add Branch</span>
                </button>
            </div>

            {/* Stats */}
            <BranchStats stats={stats} />

            {/* Search */}
            <div className="bg-white rounded-lg border border-gray-200 p-4">
                <div className="relative">
                    <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                        type="text"
                        placeholder="Search branches by name, ID, or location..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                </div>
            </div>

            {/* Table */}
            <BranchTable
                branches={filteredBranches}
                totalBranches={branches.length}
                onEdit={handleEdit}
                onDelete={handleDelete}
            />

            {/* Branch Form Modal */}
            <BranchForm
                isOpen={showModal}
                onClose={() => setShowModal(false)}
                onSave={handleSave}
                initialData={editingBranch}
            />

            {/* Delete Confirmation */}
            <ConfirmDialog
                isOpen={showDeleteConfirm}
                title="Delete Branch"
                message="Are you sure you want to delete this branch? This action cannot be undone."
                confirmText="Delete Branch"
                cancelText="Cancel"
                variant="danger"
                onConfirm={confirmDelete}
                onCancel={() => setShowDeleteConfirm(false)}
            />

            <ToastContainer
                position="top-right"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
            />
        </div>
    );
}

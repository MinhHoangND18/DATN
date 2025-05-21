import { ERole, checkPermission } from '@/lazyLoading';
import { useGetUserRedux } from '@/redux/slices/UserSlice';
import React from 'react';

interface PermissionWarpperProps {
    permissions: ERole[],
    permission?: ERole,
    children: React.ReactNode,
    classname?: string;
}

function PermissionWarpper({
    permissions,
    permission,
    children,
    classname = ''
}: PermissionWarpperProps) {
    const user = useGetUserRedux();
    if (!permission) permission = user?.role
    return (
        <div className={classname}>{checkPermission(permissions, permission) && children}</div>
    )
}

export default PermissionWarpper
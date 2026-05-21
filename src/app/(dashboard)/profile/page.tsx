'use client';

import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Briefcase,
  Star,
  Clock,
  Package,
  Truck,
  CheckCircle2,
  TrendingUp,
  Edit,
  Camera,
  Award,
  Activity,
  Save,
  X,
  Upload,
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { mockCurrentUser } from '@/lib/mock-data';
import type { User as UserType } from '@/types';

export default function ProfilePage() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [user, setUser] = useState<UserType>({
    ...mockCurrentUser,
    createdAt: new Date(mockCurrentUser.createdAt),
    updatedAt: new Date(mockCurrentUser.updatedAt),
  });

  const [formData, setFormData] = useState({
    name: user.name,
    email: user.email,
    phone: user.phone,
    address: user.address,
    department: user.department,
  });

 



  const achievements = [
    { name: 'Top Performer', icon: Award, description: 'Completed 1000+ deliveries', unlocked: true },
    { name: 'Speed Star', icon: TrendingUp, description: '30+ deliveries in a day', unlocked: true },
    { name: 'Customer Favorite', icon: Star, description: '4.9+ average rating', unlocked: true },
    { name: 'Early Bird', icon: Clock, description: '100+ early morning deliveries', unlocked: false },
  ];

  

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleOpenEditDialog = () => {
    setFormData({
      name: user.name,
      email: user.email,
      phone: user.phone,
      address: user.address,
      department: user.department,
    });
    setEditDialogOpen(true);
  };

  const handleSaveProfile = async () => {
    setIsSaving(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setUser((prev) => ({
      ...prev,
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      address: formData.address,
      department: formData.department,
      updatedAt: new Date(),
    }));
    setIsSaving(false);
    setEditDialogOpen(false);
  };

  const formatMemberSince = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'long',
      year: 'numeric',
    });
  };

  const stats = [
    { label: 'Total Deliveries', value: '156', color: 'blue', icon: Package },
    { label: 'On-Time Rate', value: '98%', color: 'green', icon: Clock },
    { label: 'Active Routes', value: '12', color: 'purple', icon: Truck },
    { label: 'Success Rate', value: '99%', color: 'yellow', icon: TrendingUp },
  ];

  return (
    <div className="space-y-6">
      <input
        type="file"
        ref={fileInputRef}
        accept="image/*"
        onChange={handleAvatarChange}
        className="hidden"
      />

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between"
      >
        <div className="flex flex-col items-center gap-6 sm:flex-row">
          <div className="relative">
            <Avatar className="h-32 w-32 border-4 border-white shadow-2xl">
              <AvatarImage src={avatarPreview || user.avatar} alt={user.name} />
              <AvatarFallback className="text-4xl bg-gradient-to-br from-yellow-500 to-yellow-500 text-white">
                {user.name.split(' ').map((n) => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <Button
              size="icon"
              variant="secondary"
              className="absolute -bottom-2 -right-2 h-10 w-10 rounded-full shadow-lg"
              onClick={handleAvatarClick}
            >
              <Camera className="h-4 w-4" />
            </Button>
          </div>
          <div className="text-center sm:text-left">
            <h1 className="text-3xl font-bold">{user.name}</h1>
            <p className="text-lg text-muted-foreground">{user.email}</p>
            <div className="mt-3 flex flex-wrap justify-center gap-2 sm:justify-start">
              <Badge className="bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400">
                <Award className="mr-1 h-3 w-3" />
                Logistique Manager
              </Badge>
              <Badge variant="secondary">
                <Activity className="mr-1 h-3 w-3" />
                Online
              </Badge>
            </div>
          </div>
        </div>
        <Button
          onClick={handleOpenEditDialog}
          className="rounded-xl bg-gradient-to-r from-yellow-400 to-yellow-400 shadow-lg shadow-yellow-500/25"
        >
          <Edit className="mr-2 h-4 w-4" />
          Edit Profile
        </Button>
      </motion.div>

      

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Profile Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="lg:col-span-2"
        >
          <Card className="border-0 shadow-soft overflow-hidden">
            <div className="bg-gradient-to-r from-yellow-500 to-amber-500 px-6 py-4">
              <CardTitle className="text-lg font-semibold text-white">Personal Information</CardTitle>
            </div>
            <CardContent className="p-6">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="group relative overflow-hidden rounded-2xl border border-border/50 p-5 transition-all hover:border-yellow-200 hover:shadow-md dark:hover:border-yellow-800">
                  <div className="absolute top-0 right-0 h-16 w-16 translate-x-8 translate-y-(-50%) rotate-12 bg-gradient-to-br from-yellow-100 to-amber-100 opacity-50 transition-transform group-hover:scale-110 dark:from-yellow-900/30 dark:to-amber-900/30" />
                  <div className="relative">
                    <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-yellow-100 dark:bg-yellow-900/30">
                      <User className="h-5 w-5 text-yellow-600" />
                    </div>
                    <p className="text-xs font-medium text-muted-foreground">Full Name</p>
                    <p className="mt-1 text-sm font-semibold">{user.name}</p>
                  </div>
                </div>
                <div className="group relative overflow-hidden rounded-2xl border border-border/50 p-5 transition-all hover:border-yellow-200 hover:shadow-md dark:hover:border-yellow-800">
                  <div className="absolute top-0 right-0 h-16 w-16 translate-x-8 translate-y-(-50%) rotate-12 bg-gradient-to-br from-yellow-100 to-amber-100 opacity-50 transition-transform group-hover:scale-110 dark:from-yellow-900/30 dark:to-amber-900/30" />
                  <div className="relative">
                    <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-yellow-100 dark:bg-yellow-900/30">
                      <Briefcase className="h-5 w-5 text-yellow-600" />
                    </div>
                    <p className="text-xs font-medium text-muted-foreground">Role</p>
                    <p className="mt-1 text-sm font-semibold">{user.role}</p>
                  </div>
                </div>
                <div className="group relative overflow-hidden rounded-2xl border border-border/50 p-5 transition-all hover:border-yellow-200 hover:shadow-md dark:hover:border-yellow-800">
                  <div className="absolute top-0 right-0 h-16 w-16 translate-x-8 translate-y-(-50%) rotate-12 bg-gradient-to-br from-yellow-100 to-amber-100 opacity-50 transition-transform group-hover:scale-110 dark:from-yellow-900/30 dark:to-amber-900/30" />
                  <div className="relative">
                    <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-yellow-100 dark:bg-yellow-900/30">
                      <Mail className="h-5 w-5 text-yellow-600" />
                    </div>
                    <p className="text-xs font-medium text-muted-foreground">Email</p>
                    <p className="mt-1 text-sm font-semibold">{user.email}</p>
                  </div>
                </div>
                <div className="group relative overflow-hidden rounded-2xl border border-border/50 p-5 transition-all hover:border-yellow-200 hover:shadow-md dark:hover:border-yellow-800">
                  <div className="absolute top-0 right-0 h-16 w-16 translate-x-8 translate-y-(-50%) rotate-12 bg-gradient-to-br from-yellow-100 to-amber-100 opacity-50 transition-transform group-hover:scale-110 dark:from-yellow-900/30 dark:to-amber-900/30" />
                  <div className="relative">
                    <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-yellow-100 dark:bg-yellow-900/30">
                      <Phone className="h-5 w-5 text-yellow-600" />
                    </div>
                    <p className="text-xs font-medium text-muted-foreground">Phone</p>
                    <p className="mt-1 text-sm font-semibold">{user.phone}</p>
                  </div>
                </div>
                <div className="group relative overflow-hidden rounded-2xl border border-border/50 p-5 transition-all hover:border-yellow-200 hover:shadow-md dark:hover:border-yellow-800 sm:col-span-2">
                  <div className="absolute top-0 right-0 h-16 w-16 translate-x-8 translate-y-(-50%) rotate-12 bg-gradient-to-br from-yellow-100 to-amber-100 opacity-50 transition-transform group-hover:scale-110 dark:from-yellow-900/30 dark:to-amber-900/30" />
                  <div className="relative">
                    <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-yellow-100 dark:bg-yellow-900/30">
                      <MapPin className="h-5 w-5 text-yellow-600" />
                    </div>
                    <p className="text-xs font-medium text-muted-foreground">Address</p>
                    <p className="mt-1 text-sm font-semibold">{user.address}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Achievements */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="border-0 shadow-soft">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Achievements</CardTitle>
              <CardDescription>Your badges and accomplishments</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {achievements.map((achievement) => (
                <div
                  key={achievement.name}
                  className={`flex items-center gap-4 rounded-xl p-3 ${
                    achievement.unlocked
                      ? 'bg-gradient-to-r from-yellow-50 to-yellow-50 dark:from-yellow-950/20 dark:to-yellow-950/20'
                      : 'bg-muted/50 opacity-60'
                  }`}
                >
                  <div
                    className={`rounded-full p-2 ${
                      achievement.unlocked
                        ? 'bg-yellow-100 dark:bg-yellow-900/50'
                        : 'bg-muted'
                    }`}
                  >
                    <achievement.icon
                      className={`h-5 w-5 ${
                        achievement.unlocked ? 'text-yellow-600' : 'text-muted-foreground'
                      }`}
                    />
                  </div>
                  <div className="flex-1">
                    <p className={`font-medium ${!achievement.unlocked && 'text-muted-foreground'}`}>
                      {achievement.name}
                    </p>
                    <p className="text-xs text-muted-foreground">{achievement.description}</p>
                  </div>
                  {achievement.unlocked && (
                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Performance & Recent Activity */}
    

      
      {/* Edit Profile Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit Profile</DialogTitle>
            <DialogDescription>
              Update your personal information
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveProfile} disabled={isSaving}>
              {isSaving ? (
                <>
                  <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Save Changes
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
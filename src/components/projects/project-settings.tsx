"use client"

import { useState } from 'react'
import { useMutation } from 'convex/react'
import { api } from '../../../convex/_generated/api'
import { Id } from '../../../convex/_generated/dataModel'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import {
    LayoutGrid,
    Table2,
    Columns3,
    Image as ImageIcon,
    Loader2,
    AlertTriangle,
    Settings,
    Save,
    ArrowLeft,
    Check,
} from 'lucide-react'
import { FieldSchemaEditor, FieldDefinition } from './field-editor'

// Schema field interface for type safety
interface SchemaField {
    fieldKey: string
    fieldName: string
    fieldType: string
    subTypes?: string[]
    simpleOptions?: string[]
    isRequired?: boolean
}

// View type options
const VIEW_TYPES = [
    { value: "table", label: "Table", icon: Table2, description: "Spreadsheet-like rows and columns" },
    { value: "kanban", label: "Kanban", icon: Columns3, description: "Drag-and-drop columns" },
    { value: "cards", label: "Cards", icon: LayoutGrid, description: "Grid of visual cards" },
    { value: "gallery", label: "Gallery", icon: ImageIcon, description: "Image-focused grid" },
]

interface ProjectSettingsProps {
    project: {
        _id: Id<"projects">
        name: string
        description?: string
        defaultView?: string
        isSetupComplete?: boolean
    }
    schema: SchemaField[]
    recordCount: number
    isOpen: boolean
    onClose: () => void
}

export function ProjectSettings({
    project,
    schema,
    recordCount,
    isOpen,
    onClose
}: ProjectSettingsProps) {
    // Form state
    const [name, setName] = useState(project.name)
    const [description, setDescription] = useState(project.description || '')
    const [defaultView, setDefaultView] = useState(project.defaultView || 'table')
    const [fields, setFields] = useState<FieldDefinition[]>(
        schema.map(f => ({
            fieldKey: f.fieldKey,
            fieldName: f.fieldName,
            fieldType: f.fieldType,
            subTypes: f.subTypes,
            simpleOptions: f.simpleOptions,
            isRequired: f.isRequired,
        }))
    )

    // UI state
    const [isSaving, setIsSaving] = useState(false)
    const [showWarning, setShowWarning] = useState(false)
    const [pendingChanges, setPendingChanges] = useState<{
        hasFieldTypeChanges: boolean
        hasFieldRemovals: boolean
        removedFields: string[]
        changedFields: string[]
    } | null>(null)

    // Mutations
    const updateProject = useMutation(api.projects.updateProject)
    const saveFieldSchema = useMutation(api.projects.saveFieldSchema)

    // Check for breaking changes
    const detectBreakingChanges = () => {
        const newFieldKeys = new Set(fields.map(f => f.fieldKey))

        // Removed fields
        const removedFields: string[] = []
        schema.forEach((f: SchemaField) => {
            if (!newFieldKeys.has(f.fieldKey)) {
                removedFields.push(f.fieldName)
            }
        })

        // Type-changed fields (only count as breaking if there's data)
        const changedFields: string[] = []
        fields.forEach(f => {
            const originalField = schema.find((of: SchemaField) => of.fieldKey === f.fieldKey)
            if (originalField && originalField.fieldType !== f.fieldType) {
                changedFields.push(f.fieldName || originalField.fieldName)
            }
        })

        const hasFieldRemovals = removedFields.length > 0
        const hasFieldTypeChanges = changedFields.length > 0

        return {
            hasFieldTypeChanges,
            hasFieldRemovals,
            removedFields,
            changedFields,
        }
    }

    const handleSave = async () => {
        // Check for breaking changes when there's existing data
        if (recordCount > 0) {
            const changes = detectBreakingChanges()
            if (changes.hasFieldRemovals || changes.hasFieldTypeChanges) {
                setPendingChanges(changes)
                setShowWarning(true)
                return
            }
        }

        await performSave()
    }

    const performSave = async () => {
        setIsSaving(true)
        try {
            // Update project metadata
            await updateProject({
                id: project._id,
                name,
                description: description || undefined,
                defaultView: defaultView as "table" | "kanban" | "cards" | "gallery",
            })

            // Update field schema
            const validFields = fields.filter(f => f.fieldName.trim())
            if (validFields.length > 0) {
                await saveFieldSchema({
                    projectId: project._id,
                    fields: validFields.map((f, i) => ({
                        fieldKey: f.fieldKey || `field${i + 1}`,
                        fieldName: f.fieldName.trim(),
                        fieldType: f.fieldType,
                        subTypes: f.subTypes,
                        simpleOptions: f.simpleOptions,
                        isRequired: f.isRequired,
                    })),
                })
            }

            onClose()
        } catch (error) {
            console.error("Save error:", error)
            alert(error instanceof Error ? error.message : "Failed to save settings")
        } finally {
            setIsSaving(false)
            setShowWarning(false)
            setPendingChanges(null)
        }
    }

    return (
        <>
            <Dialog open={isOpen} onOpenChange={onClose}>
                <DialogContent
                    className="max-w-7xl h-[calc(100vh-4rem)]"

                >
                    <DialogHeader className="p-6 border-b shrink-0 sm:text-left">
                        <div className="w-full">
                            <DialogTitle className="flex items-center gap-2 text-2xl">
                                <Settings className="h-6 w-6" />
                                Project Settings
                            </DialogTitle>
                            <DialogDescription className="text-base mt-1">
                                Configure your project&apos;s name, view type, and field schema.
                            </DialogDescription>
                        </div>
                    </DialogHeader>

                    <div className="flex-1 overflow-y-auto">
                        <div className="w-full p-6 space-y-8">
                            {/* Basic Info - 2 column grid on desktop */}
                            <Card className="border-none shadow-none bg-muted/30">
                                <CardHeader className="pb-4">
                                    <CardTitle className="text-lg">General</CardTitle>
                                    <CardDescription>Basic project information</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid gap-6 md:grid-cols-2">
                                        <div className="space-y-2">
                                            <Label htmlFor="project-name" className="text-sm font-semibold">Project Name</Label>
                                            <Input
                                                id="project-name"
                                                value={name}
                                                onChange={(e) => setName(e.target.value)}
                                                placeholder="My Project"
                                                className="bg-background"
                                            />
                                        </div>
                                        <div className="space-y-2 md:col-span-2">
                                            <Label htmlFor="project-description" className="text-sm font-semibold">Description</Label>
                                            <Textarea
                                                id="project-description"
                                                value={description}
                                                onChange={(e) => setDescription(e.target.value)}
                                                placeholder="What is this project about?"
                                                rows={3}
                                                className="bg-background"
                                            />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* View Type - Compact horizontal layout */}
                            <Card className="border-none shadow-none bg-muted/30">
                                <CardHeader className="pb-4">
                                    <CardTitle className="text-lg">Default View</CardTitle>
                                    <CardDescription>How your data is displayed by default</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-4">
                                        {VIEW_TYPES.map((type) => (
                                            <div
                                                key={type.value}
                                                className={`cursor-pointer p-4 rounded-xl border-2 transition-all hover:shadow-md ${defaultView === type.value
                                                    ? 'border-primary bg-primary/5 shadow-sm'
                                                    : 'border-background bg-background hover:border-primary/50'
                                                    }`}
                                                onClick={() => setDefaultView(type.value)}
                                            >
                                                <div className="flex flex-col gap-3">
                                                    <div className={`shrink-0 h-10 w-10 rounded-lg flex items-center justify-center ${defaultView === type.value
                                                        ? 'bg-primary text-primary-foreground'
                                                        : 'bg-muted'
                                                        }`}>
                                                        <type.icon className="h-5 w-5" />
                                                    </div>
                                                    <div className="min-w-0">
                                                        <div className="flex items-center justify-between mb-1">
                                                            <p className="text-sm font-bold truncate">{type.label}</p>
                                                            {defaultView === type.value && (
                                                                <Check className="shrink-0 h-4 w-4 text-primary" />
                                                            )}
                                                        </div>
                                                        <p className="text-xs text-muted-foreground line-clamp-2">{type.description}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Field Schema - with better spacing */}
                            <Card className="border-none shadow-none bg-muted/30">
                                <CardHeader className="pb-4">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <CardTitle className="text-lg">Field Schema</CardTitle>
                                            <CardDescription>
                                                Define the fields for your records
                                                {recordCount > 0 && (
                                                    <span className="ml-2 inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium bg-amber-500/10 text-amber-500">
                                                        {recordCount} existing records
                                                    </span>
                                                )}
                                            </CardDescription>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <FieldSchemaEditor
                                        fields={fields}
                                        onChange={setFields}
                                    />
                                </CardContent>
                            </Card>
                        </div>
                    </div>

                    <DialogFooter className="p-6 border-t shrink-0">
                        <div className="w-full flex justify-end gap-3">
                            <Button variant="outline" onClick={onClose} disabled={isSaving} size="lg">
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Cancel
                            </Button>
                            <Button onClick={handleSave} disabled={isSaving || !name.trim()} size="lg" className="px-8">
                                {isSaving ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Saving...
                                    </>
                                ) : (
                                    <>
                                        <Save className="mr-2 h-4 w-4" />
                                        Save Changes
                                    </>
                                )}
                            </Button>
                        </div>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Warning Dialog for Breaking Changes */}
            <AlertDialog open={showWarning} onOpenChange={setShowWarning}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle className="flex items-center gap-2 text-amber-500">
                            <AlertTriangle className="h-5 w-5" />
                            Warning: Data May Be Lost
                        </AlertDialogTitle>
                        <AlertDialogDescription asChild>
                            <div className="space-y-3">
                                <p>
                                    You have <strong>{recordCount} existing records</strong>.
                                    The following changes may affect your data:
                                </p>

                                {pendingChanges?.removedFields && pendingChanges.removedFields.length > 0 && (
                                    <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20">
                                        <p className="font-medium text-destructive">Removed Fields:</p>
                                        <ul className="list-disc list-inside text-sm mt-1">
                                            {pendingChanges.removedFields.map((f, i) => (
                                                <li key={i}>{f}</li>
                                            ))}
                                        </ul>
                                        <p className="text-xs mt-2 text-destructive/80">
                                            Data in these fields will be permanently deleted.
                                        </p>
                                    </div>
                                )}

                                {pendingChanges?.changedFields && pendingChanges.changedFields.length > 0 && (
                                    <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/20">
                                        <p className="font-medium text-amber-600">Type Changes:</p>
                                        <ul className="list-disc list-inside text-sm mt-1">
                                            {pendingChanges.changedFields.map((f, i) => (
                                                <li key={i}>{f}</li>
                                            ))}
                                        </ul>
                                        <p className="text-xs mt-2 text-amber-600/80">
                                            Existing data may not be compatible with the new type.
                                        </p>
                                    </div>
                                )}
                            </div>
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={performSave}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                            {isSaving ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Saving...
                                </>
                            ) : (
                                'Proceed Anyway'
                            )}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    )
}

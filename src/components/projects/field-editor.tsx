"use client"

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
    Menubar,
    MenubarCheckboxItem,
    MenubarContent,
    MenubarItem,
    MenubarMenu,
    MenubarSeparator,
    MenubarSub,
    MenubarSubContent,
    MenubarSubTrigger,
    MenubarTrigger,
} from '@/components/ui/menubar'
import {
    Plus,
    Trash2,
    GripVertical,
    Type,
    AlignLeft,
    FileText,
    Link2,
    Mail,
    Phone,
    Hash,
    DollarSign,
    Percent,
    Star,
    Calendar,
    Clock,
    Timer,
    List,
    CheckSquare,
    ToggleLeft,
    MapPin,
    Image,
    File,
    User,
    GitBranch,
    Calculator,
    ScanLine,
    Palette,
    Tags,
    ListChecks,
    CircleDot,
    ChevronDown,
} from 'lucide-react'
import { cn } from '@/lib/utils'

// ============================================================================
// FIELD TYPE DEFINITIONS
// ============================================================================

export type FieldCategory =
    | 'text'
    | 'numbers'
    | 'datetime'
    | 'selection'
    | 'boolean'
    | 'location'
    | 'media'
    | 'relations'
    | 'special'

export interface FieldTypeDefinition {
    value: string
    label: string
    icon: React.ReactNode
    category: FieldCategory
    description?: string
    hasSubTypes?: boolean
    subTypes?: { value: string; label: string; description?: string }[]
    defaultLabel?: string // Auto-fill label when selected
}

// Comprehensive field types covering 80%+ of industry standards
export const FIELD_TYPES: FieldTypeDefinition[] = [
    // Text types
    {
        value: 'text',
        label: 'Text',
        icon: <Type className="h-4 w-4" />,
        category: 'text',
        description: 'Single line of text',
        defaultLabel: 'Text'
    },
    {
        value: 'textarea',
        label: 'Long Text',
        icon: <AlignLeft className="h-4 w-4" />,
        category: 'text',
        description: 'Multi-line text area',
        defaultLabel: 'Description'
    },
    {
        value: 'richtext',
        label: 'Rich Text',
        icon: <FileText className="h-4 w-4" />,
        category: 'text',
        description: 'Formatted text with styles',
        defaultLabel: 'Content'
    },

    // URL & Links
    {
        value: 'url',
        label: 'URL',
        icon: <Link2 className="h-4 w-4" />,
        category: 'text',
        description: 'Web link',
        defaultLabel: 'URL'
    },
    {
        value: 'email',
        label: 'Email',
        icon: <Mail className="h-4 w-4" />,
        category: 'text',
        description: 'Email address',
        defaultLabel: 'Email'
    },
    {
        value: 'phone',
        label: 'Phone',
        icon: <Phone className="h-4 w-4" />,
        category: 'text',
        description: 'Phone number',
        defaultLabel: 'Phone'
    },

    // Numbers
    {
        value: 'number',
        label: 'Number',
        icon: <Hash className="h-4 w-4" />,
        category: 'numbers',
        description: 'Numeric value',
        defaultLabel: 'Number'
    },
    {
        value: 'currency',
        label: 'Currency',
        icon: <DollarSign className="h-4 w-4" />,
        category: 'numbers',
        description: 'Money value',
        defaultLabel: 'Price'
    },
    {
        value: 'percentage',
        label: 'Percentage',
        icon: <Percent className="h-4 w-4" />,
        category: 'numbers',
        description: 'Percentage value',
        defaultLabel: 'Percentage'
    },
    {
        value: 'rating',
        label: 'Rating',
        icon: <Star className="h-4 w-4" />,
        category: 'numbers',
        description: '1-5 star rating',
        defaultLabel: 'Rating'
    },

    // Date & Time
    {
        value: 'date',
        label: 'Date',
        icon: <Calendar className="h-4 w-4" />,
        category: 'datetime',
        description: 'Calendar date',
        defaultLabel: 'Date'
    },
    {
        value: 'datetime',
        label: 'Date & Time',
        icon: <Clock className="h-4 w-4" />,
        category: 'datetime',
        description: 'Date with time',
        defaultLabel: 'Date & Time'
    },
    {
        value: 'time',
        label: 'Time',
        icon: <Clock className="h-4 w-4" />,
        category: 'datetime',
        description: 'Time only',
        defaultLabel: 'Time'
    },
    {
        value: 'duration',
        label: 'Duration',
        icon: <Timer className="h-4 w-4" />,
        category: 'datetime',
        description: 'Time span',
        defaultLabel: 'Duration'
    },

    // Selection
    {
        value: 'select',
        label: 'Dropdown',
        icon: <List className="h-4 w-4" />,
        category: 'selection',
        description: 'Single choice from list',
        defaultLabel: 'Select'
    },
    {
        value: 'multiselect',
        label: 'Multi-Select',
        icon: <ListChecks className="h-4 w-4" />,
        category: 'selection',
        description: 'Multiple choices from list',
        defaultLabel: 'Options'
    },
    {
        value: 'status',
        label: 'Status',
        icon: <CircleDot className="h-4 w-4" />,
        category: 'selection',
        description: 'Status with colors',
        defaultLabel: 'Status'
    },
    {
        value: 'tags',
        label: 'Tags',
        icon: <Tags className="h-4 w-4" />,
        category: 'selection',
        description: 'Tag list',
        defaultLabel: 'Tags'
    },

    // Boolean
    {
        value: 'checkbox',
        label: 'Checkbox',
        icon: <CheckSquare className="h-4 w-4" />,
        category: 'boolean',
        description: 'True/false checkbox',
        defaultLabel: 'Completed'
    },
    {
        value: 'toggle',
        label: 'Toggle',
        icon: <ToggleLeft className="h-4 w-4" />,
        category: 'boolean',
        description: 'On/off switch',
        defaultLabel: 'Active'
    },

    // Location (with sub-types)
    {
        value: 'location',
        label: 'Location',
        icon: <MapPin className="h-4 w-4" />,
        category: 'location',
        description: 'Geographic location',
        defaultLabel: 'Location',
        hasSubTypes: true,
        subTypes: [
            { value: 'string', label: 'Text Only', description: 'Just the location name' },
            { value: 'url', label: 'With URL', description: 'Location + Map link' },
            { value: 'geocoords', label: 'Coordinates', description: 'Latitude/Longitude' },
            { value: 'address', label: 'Full Address', description: 'Street, City, Country' },
        ]
    },

    // Media
    {
        value: 'file',
        label: 'File',
        icon: <File className="h-4 w-4" />,
        category: 'media',
        description: 'File attachment',
        defaultLabel: 'Attachment'
    },
    {
        value: 'image',
        label: 'Image',
        icon: <Image className="h-4 w-4" />,
        category: 'media',
        description: 'Image file',
        defaultLabel: 'Image'
    },

    // Relations
    {
        value: 'user',
        label: 'User',
        icon: <User className="h-4 w-4" />,
        category: 'relations',
        description: 'User reference',
        defaultLabel: 'Assigned To'
    },
    {
        value: 'relation',
        label: 'Relation',
        icon: <GitBranch className="h-4 w-4" />,
        category: 'relations',
        description: 'Link to another record',
        defaultLabel: 'Related To'
    },

    // Special
    {
        value: 'formula',
        label: 'Formula',
        icon: <Calculator className="h-4 w-4" />,
        category: 'special',
        description: 'Calculated field',
        defaultLabel: 'Formula'
    },
    {
        value: 'autonumber',
        label: 'Auto Number',
        icon: <Hash className="h-4 w-4" />,
        category: 'special',
        description: 'Auto-incrementing ID',
        defaultLabel: 'ID'
    },
    {
        value: 'barcode',
        label: 'Barcode',
        icon: <ScanLine className="h-4 w-4" />,
        category: 'special',
        description: 'Barcode/QR code',
        defaultLabel: 'Barcode'
    },
    {
        value: 'color',
        label: 'Color',
        icon: <Palette className="h-4 w-4" />,
        category: 'special',
        description: 'Color picker',
        defaultLabel: 'Color'
    },
]

// Category grouping
export const FIELD_CATEGORIES: { value: FieldCategory; label: string }[] = [
    { value: 'text', label: 'Text' },
    { value: 'numbers', label: 'Numbers' },
    { value: 'datetime', label: 'Date & Time' },
    { value: 'selection', label: 'Selection' },
    { value: 'boolean', label: 'Boolean' },
    { value: 'location', label: 'Location' },
    { value: 'media', label: 'Media' },
    { value: 'relations', label: 'Relations' },
    { value: 'special', label: 'Special' },
]

// ============================================================================
// FIELD DEFINITION INTERFACE
// ============================================================================

export interface FieldDefinition {
    fieldKey: string
    fieldName: string
    fieldType: string
    subTypes?: string[] // For location: ['string', 'url', 'geocoords']
    simpleOptions?: string[]
    isRequired?: boolean
    currencySymbol?: string
    placeholder?: string
}

// ============================================================================
// FIELD TYPE SELECTOR (with Menubar for complex types)
// ============================================================================

interface FieldTypeSelectorProps {
    value: string
    subTypes?: string[]
    onChange: (type: string, subTypes?: string[]) => void
}

export function FieldTypeSelector({ value, subTypes = [], onChange }: FieldTypeSelectorProps) {
    const selectedType = FIELD_TYPES.find(t => t.value === value)

    return (
        <Menubar className="border-border/50 bg-background">
            <MenubarMenu>
                <MenubarTrigger className="flex items-center gap-2 px-3 py-1.5 cursor-pointer">
                    {selectedType?.icon}
                    <span>{selectedType?.label || 'Select Type'}</span>
                    <ChevronDown className="h-3 w-3 ml-1 opacity-50" />
                </MenubarTrigger>
                <MenubarContent className="min-w-[260px] max-h-[400px] overflow-y-auto">
                    {FIELD_CATEGORIES.map((category) => {
                        const categoryTypes = FIELD_TYPES.filter(t => t.category === category.value)
                        if (categoryTypes.length === 0) return null

                        return (
                            <React.Fragment key={category.value}>
                                <MenubarItem disabled className="text-xs font-semibold text-muted-foreground uppercase tracking-wider py-1">
                                    {category.label}
                                </MenubarItem>
                                {categoryTypes.map((type) => (
                                    type.hasSubTypes ? (
                                        <MenubarSub key={type.value}>
                                            <MenubarSubTrigger className="flex items-center gap-2">
                                                {type.icon}
                                                {type.label}
                                            </MenubarSubTrigger>
                                            <MenubarSubContent>
                                                {type.subTypes?.map((subType) => (
                                                    <MenubarCheckboxItem
                                                        key={subType.value}
                                                        checked={value === type.value && subTypes.includes(subType.value)}
                                                        onCheckedChange={(checked) => {
                                                            if (checked) {
                                                                // Always set the main type when checking a subtype
                                                                const newSubTypes = [...subTypes, subType.value]
                                                                onChange(type.value, newSubTypes)
                                                            } else {
                                                                const newSubTypes = subTypes.filter(s => s !== subType.value)
                                                                // If no subtypes left and current type is this, keep type
                                                                onChange(type.value, newSubTypes)
                                                            }
                                                        }}
                                                    >
                                                        <div className="flex flex-col">
                                                            <span>{subType.label}</span>
                                                            {subType.description && (
                                                                <span className="text-xs text-muted-foreground">{subType.description}</span>
                                                            )}
                                                        </div>
                                                    </MenubarCheckboxItem>
                                                ))}
                                            </MenubarSubContent>
                                        </MenubarSub>
                                    ) : (
                                        <MenubarItem
                                            key={type.value}
                                            className={cn(
                                                "flex items-center gap-2 cursor-pointer",
                                                value === type.value && "bg-accent"
                                            )}
                                            onClick={() => onChange(type.value, [])}
                                        >
                                            {type.icon}
                                            <div className="flex flex-col">
                                                <span>{type.label}</span>
                                                {type.description && (
                                                    <span className="text-xs text-muted-foreground">{type.description}</span>
                                                )}
                                            </div>
                                        </MenubarItem>
                                    )
                                ))}
                                <MenubarSeparator />
                            </React.Fragment>
                        )
                    })}
                </MenubarContent>
            </MenubarMenu>
        </Menubar>
    )
}

// ============================================================================
// FIELD ROW EDITOR
// ============================================================================

interface FieldRowProps {
    field: FieldDefinition
    index: number
    onUpdate: (index: number, updates: Partial<FieldDefinition>) => void
    onRemove: (index: number) => void
    canRemove: boolean
}

export function FieldRow({ field, index, onUpdate, onRemove, canRemove }: FieldRowProps) {
    const handleTypeChange = (type: string, subTypes?: string[]) => {
        const typeDef = FIELD_TYPES.find(t => t.value === type)

        // Auto-fill field name if empty or if it matches the previous type's default
        const currentTypeDef = FIELD_TYPES.find(t => t.value === field.fieldType)
        const shouldAutoFill = !field.fieldName || field.fieldName === currentTypeDef?.defaultLabel

        onUpdate(index, {
            fieldType: type,
            subTypes: subTypes,
            fieldName: shouldAutoFill && typeDef?.defaultLabel ? typeDef.defaultLabel : field.fieldName,
        })
    }

    return (
        <div className="flex items-center gap-3 p-4 border rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
            {/* Drag Handle */}
            <div className="text-muted-foreground cursor-grab hover:text-foreground shrink-0">
                <GripVertical className="h-5 w-5" />
            </div>

            {/* Field Number Badge */}
            <div className="shrink-0 h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-medium text-primary">
                {index + 1}
            </div>

            {/* Field Configuration Grid */}
            <div className="flex-1 grid gap-4 grid-cols-1 md:grid-cols-[1fr_1fr_auto] items-center">
                {/* Field Name Input */}
                <div className="space-y-1">
                    <Label className="text-xs text-muted-foreground">Field Name</Label>
                    <Input
                        placeholder="Enter field name..."
                        value={field.fieldName}
                        onChange={(e) => onUpdate(index, { fieldName: e.target.value })}
                        className="h-9"
                    />
                </div>

                {/* Field Type Selector */}
                <div className="space-y-1">
                    <Label className="text-xs text-muted-foreground">Field Type</Label>
                    <FieldTypeSelector
                        value={field.fieldType}
                        subTypes={field.subTypes}
                        onChange={handleTypeChange}
                    />
                </div>

                {/* Sub-type badges (shown inline on desktop) */}
                <div className="flex flex-wrap gap-1 min-w-[100px]">
                    {field.subTypes && field.subTypes.length > 0 ? (
                        field.subTypes.map((st) => (
                            <span
                                key={st}
                                className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full font-medium"
                            >
                                +{st}
                            </span>
                        ))
                    ) : (
                        <span className="text-xs text-muted-foreground/50 hidden md:inline">—</span>
                    )}
                </div>
            </div>

            {/* Delete Button */}
            <Button
                variant="ghost"
                size="icon"
                className="shrink-0 text-destructive/60 hover:text-destructive hover:bg-destructive/10"
                onClick={() => onRemove(index)}
                disabled={!canRemove}
            >
                <Trash2 className="h-4 w-4" />
            </Button>
        </div>
    )
}

// ============================================================================
// FIELD SCHEMA EDITOR (full component)
// ============================================================================

interface FieldSchemaEditorProps {
    fields: FieldDefinition[]
    onChange: (fields: FieldDefinition[]) => void
}

export function FieldSchemaEditor({ fields, onChange }: FieldSchemaEditorProps) {
    const handleAddField = () => {
        const newKey = `field${fields.length + 1}`
        onChange([...fields, { fieldKey: newKey, fieldName: '', fieldType: 'text' }])
    }

    const handleUpdateField = (index: number, updates: Partial<FieldDefinition>) => {
        const updated = [...fields]
        updated[index] = { ...updated[index], ...updates }
        onChange(updated)
    }

    const handleRemoveField = (index: number) => {
        if (fields.length > 1) {
            onChange(fields.filter((_, i) => i !== index))
        }
    }

    return (
        <div className="space-y-3">
            {/* Header row - only visible on desktop */}
            <div className="hidden md:flex items-center gap-3 px-4 py-2 text-xs font-medium text-muted-foreground uppercase tracking-wide">
                <div className="w-5" /> {/* Drag handle space */}
                <div className="w-8" /> {/* Number badge space */}
                <div className="flex-1 grid gap-4 grid-cols-[1fr_1fr_auto]">
                    <div>Field Name</div>
                    <div>Field Type</div>
                    <div className="min-w-[100px]">Sub-types</div>
                </div>
                <div className="w-10" /> {/* Delete button space */}
            </div>

            {/* Field rows */}
            {fields.map((field, index) => (
                <FieldRow
                    key={field.fieldKey}
                    field={field}
                    index={index}
                    onUpdate={handleUpdateField}
                    onRemove={handleRemoveField}
                    canRemove={fields.length > 1}
                />
            ))}

            {/* Add field button */}
            <Button
                variant="outline"
                onClick={handleAddField}
                className="w-full border-dashed hover:border-primary/50 hover:bg-primary/5"
            >
                <Plus className="mr-2 h-4 w-4" />
                Add Field
            </Button>
        </div>
    )
}

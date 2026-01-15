   Creating an optimized production build ...
Using vars defined in .dev.vars
 ✓ Compiled successfully in 4.9s

./src/components/projects/field-editor.tsx
283:15  Warning: Image elements must have an alt prop, either with meaningful text, or an empty string for decorative images.  jsx-a11y/alt-text

info  - Need to disable some ESLint rules? Learn more here: https://nextjs.org/docs/app/api-reference/config/eslint#disabling-rules
Failed to compile.

./src/app/(dashboard)/o/[slug]/[project]/page.tsx:426:25 
Type error: Type '{ _id: Id<"projectFields">; _creationTime: number; formula?: string | undefined; subTypes?: string[] | undefined; options?: { color?: string | undefined; value: string; label: string; }[] | undefined; ... 18 more ...; order: number; }[]' is not assignable to type 'FieldSchema[]'.
  Type '{ _id: Id<"projectFields">; _creationTime: number; formula?: string | undefined; subTypes?: string[] | undefined; options?: { color?: string | undefined; value: string; label: string; }[] | undefined; ... 18 more ...; order: number; }' is not assignable to type 'FieldSchema'. 
    Types of property 'options' are incompatible.        
      Type '{ color?: string | undefined; value: string; label: string; }[] | undefined' is not assignable to type 'string[] | undefined'.
        Type '{ color?: string | undefined; value: string; label: string; }[]' is not assignable to type 'string[]'.
          Type '{ color?: string | undefined; value: string; label: string; }' is not assignable to type 'string'.

  424 |                 {currentView === "table" && (    
  425 |                     <TableView
> 426 |                         schema={schema}
      |                         ^
  427 |                         records={records}        
  428 |                         onDelete={handleDeleteRecord}
  429 |                     />
Next.js build worker exited with code: 1 and signal: null
 ELIFECYCLE  Command failed with exit code 1.
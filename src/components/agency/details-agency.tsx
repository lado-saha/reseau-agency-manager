'use client';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import {
  DetailViewMode,
  TabsAgencyDetails,
  transposeMatrix
} from '@/lib/models/helpers';
// import { Tabs, TabsList, TabsTrigger } from '@/componentsreact-tabs';
import {
  InfoIcon,
  SaveIcon,
  Trash2Icon,
  Check,
  UserCheckIcon,
  ScaleIcon,
  GlobeIcon
} from 'lucide-react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TabsContent } from '@radix-ui/react-tabs';
import VehicleModelSchemaEditor from '../vehicles/editor-vehicle-model-schema';
import { AgencyProfile } from '@/lib/models/agency';

export function AgencyDetailView({
  originalAgency
}: {
  originalAgency: AgencyProfile | undefined;
}) {
  const mode: DetailViewMode =
    originalAgency !== undefined ? 'edit-mode' : 'creation-mode';
  const [rows, setRows] = useState(5);
  const [columns, setColumns] = useState(8);
  const [matrix, setMatrix] = useState<number[][]>(
    Array(rows)
      .fill(null)
      .map(() => Array(columns).fill(1)) // 1 means seat, initially all are seats
  );

  const [tab, setTab] = useState<TabsAgencyDetails>('creator-info');
  // const router = useRouter();
  const handleSaveOrUpdateClick = () => {
    // throw new Error('Function not implemented.');
  };

  const handleDeleteClick = () => {
    // throw new Error('Function not implemented.');
  };

  const handleRotateSchemaClick = () => {
    setMatrix(transposeMatrix(matrix));
  };

  return (
    <Tabs
      defaultValue={tab}
      onValueChange={(value) => setTab(value as TabsAgencyDetails)}
    >
      {/* Tabs for filtering */}
      <div className="flex items-center mt-2 mb-2">
        <TabsList>
          <TabsTrigger value="info" className="items-center">
            <UserCheckIcon className="mx-1 w-4 h-4" />
            <span className="hidden sm:inline">Creator's Info</span>
          </TabsTrigger>

          <TabsTrigger value="schema" className="items-center">
            <InfoIcon className="mx-1 w-4 h-4" />
            <span className="hidden sm:inline">Basic Info</span>
          </TabsTrigger>

          <TabsTrigger value="stats" className="items-center">
            <ScaleIcon className="mx-1 w-4 h-4" />
            <span className="hidden sm:inline">Legal Info</span>
          </TabsTrigger>

          <TabsTrigger value="stats" className="items-center">
            <GlobeIcon className="mx-1 w-4 h-4" />
            <span className="hidden sm:inline">Social Media</span>
          </TabsTrigger>
        </TabsList>

        <div className="ml-auto flex items-center gap-2 ">
          <>
            {/* {tab === 'schema' ? (
              <Button
                size="sm"
                variant={'outline'}
                className="h-8 gap-1"
                type="submit"
                onClick={handleRotateSchemaClick}
              >
                <Rotate3dIcon className="h-3.5 w-3.5" />
                <span className="hidden md:inline">Rotate Schema</span>
              </Button>
            ) : (
              <></>
            )} */}
            {mode !== 'creation-mode' ? (
              <Button
                size="sm"
                className="h-8 gap-1"
                type="submit"
                onClick={handleSaveOrUpdateClick}
              >
                <SaveIcon className="h-3.5 w-3.5" />
                <span className="hidden md:inline">Create Agency</span>
              </Button>
            ) : (
              <>
                <Button
                  size="sm"
                  type="submit"
                  className="h-8 gap-1"
                  onClick={handleSaveOrUpdateClick}
                >
                  <Check className="h-3.5 w-3.5" />
                  <span className="hidden md:inline">Update Agency</span>
                </Button>

                <Button
                  variant="destructive"
                  size="sm"
                  className="h-8 gap-1"
                  onClick={handleDeleteClick}
                >
                  <Trash2Icon className="h-3.5 w-3.5" />
                  <span className="hidden md:inline">Delete</span>
                </Button>
              </>
            )}
          </>
        </div>
      </div>

      <TabsContent value={tab} className="overflow-x-hidden">
        {tab === 'basic-info' ? (
          <VehicleModelSchemaEditor
            rows={rows}
            columns={columns}
            matrix={matrix}
            setMatrixChange={setMatrix}
            setColumnsChange={setColumns}
            setRowsChange={setRows}
          />
        ) : (
          <VehicleModelSchemaEditor
            rows={rows}
            columns={columns}
            matrix={matrix}
            setMatrixChange={setMatrix}
            setColumnsChange={setColumns}
            setRowsChange={setRows}
          />
        )}
      </TabsContent>
    </Tabs>
  );
}

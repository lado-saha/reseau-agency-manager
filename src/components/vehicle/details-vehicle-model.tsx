'use client';
import { Button } from '@/components/ui/button';
import { VehicleModel } from '@/lib/models/resource';
import { useState } from 'react';
import { useRouter } from 'next/router';
import {
  DetailViewMode,
  TabsVehicleModelDetails,
  transposeMatrix
} from '@/lib/models/helpers';
// import { Tabs, TabsList, TabsTrigger } from '@/componentsreact-tabs';
import {
  InfoIcon,
  HammerIcon,
  BarChartBigIcon,
  SaveIcon,
  Trash2Icon,
  Check,
  RotateCcwIcon,
  Rotate3dIcon
} from 'lucide-react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TabsContent } from '@radix-ui/react-tabs';
import { VehicleModelForm } from './form-vehicle-model';
import VehicleModelLayoutEditor from './editor-vehicle-model-schema';

export function VehicleModelDetailView({
  id, originalModel, adminId, agencyId
}: {
  id: string, originalModel: VehicleModel | undefined;
  adminId: string, agencyId: string
}) {
  const mode: DetailViewMode =
    originalModel !== undefined ? 'edit-mode' : 'creation-mode';
  const [rows, setRows] = useState(5);
  const [columns, setColumns] = useState(8);
  const [matrix, setMatrix] = useState<number[][]>(
    Array(rows)
      .fill(null)
      .map(() => Array(columns).fill(1)) // 1 means seat, initially all are seats
  );

  const [tab, setTab] = useState<TabsVehicleModelDetails>('info');
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
      onValueChange={(value) => setTab(value as TabsVehicleModelDetails)}
    >
      {/* Tabs for filtering */}
      <div className="flex items-center mt-2 mb-2">
        <TabsList>
          <TabsTrigger value="info" className="items-center">
            <InfoIcon className="mx-1 w-4 h-4" />
            <span className="hidden sm:inline">General Info</span>
          </TabsTrigger>

          <TabsTrigger value="schema" className="items-center">
            <HammerIcon className="mx-1 w-4 h-4" />
            <span className="hidden sm:inline">Seats Schema</span>
          </TabsTrigger>

          <TabsTrigger value="stats" className="items-center">
            <BarChartBigIcon className="mx-1 w-4 h-4" />
            <span className="hidden sm:inline">Statistics</span>
          </TabsTrigger>
        </TabsList>

        <div className="ml-auto flex items-center gap-2 ">
          <>
            {tab === 'layout' ? (
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
            )}
            {mode !== 'creation-mode' ? (
              <Button
                size="sm"
                className="h-8 gap-1"
                type="submit"
                onClick={handleSaveOrUpdateClick}
              >
                <SaveIcon className="h-3.5 w-3.5" />
                <span className="hidden md:inline">Save New Model</span>
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
                  <span className="hidden md:inline">Update Model</span>
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
        {tab === 'info' ? (
          <VehicleModelForm id={id}agencyId={agencyId} adminId={adminId} onSubmitCompleteAction={() => { }} originalModel={originalModel} />
        ) : (
          <></>
        )}
      </TabsContent>
    </Tabs>
  );
}

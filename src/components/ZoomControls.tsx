import { ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';

interface ZoomControlsProps {
  zoom: number;
  onZoomChange: (zoom: number) => void;
  onReset: () => void;
}

const ZoomControls = ({ zoom, onZoomChange, onReset }: ZoomControlsProps) => {
  const handleZoomIn = () => {
    onZoomChange(Math.min(zoom + 0.2, 3));
  };

  const handleZoomOut = () => {
    onZoomChange(Math.max(zoom - 0.2, 0.5));
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center justify-between">
          <span>Zoom</span>
          <span className="text-sm font-normal text-muted-foreground">{Math.round(zoom * 100)}%</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={handleZoomOut}
            disabled={zoom <= 0.5}
            className="h-8 w-8"
          >
            <ZoomOut className="h-4 w-4" />
          </Button>
          
          <Slider
            value={[zoom]}
            onValueChange={(value) => onZoomChange(value[0])}
            min={0.5}
            max={3}
            step={0.1}
            className="flex-1"
          />
          
          <Button
            variant="outline"
            size="icon"
            onClick={handleZoomIn}
            disabled={zoom >= 3}
            className="h-8 w-8"
          >
            <ZoomIn className="h-4 w-4" />
          </Button>
          
          <Button
            variant="outline"
            size="icon"
            onClick={onReset}
            className="h-8 w-8"
            title="Reset zoom"
          >
            <RotateCcw className="h-4 w-4" />
          </Button>
        </div>
        
        <p className="text-xs text-muted-foreground text-center">
          ใช้ mouse wheel เพื่อซูมบนกราฟ
        </p>
      </CardContent>
    </Card>
  );
};

export default ZoomControls;

import { useState } from 'react';
import { MP } from '@/types/parliament';
import { Card } from '@/components/ui/card';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Check, ChevronsUpDown, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { z } from 'zod';

interface VoterSearchProps {
  mps: MP[];
  selectedMP: MP | null;
  onMPSelect: (mp: MP | null) => void;
}

const searchSchema = z.object({
  query: z.string().trim().max(100, { message: "Search query too long" }),
});

const VoterSearch = ({ mps, selectedMP, onMPSelect }: VoterSearchProps) => {
  const [open, setOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');

  const handleSearch = (value: string) => {
    try {
      searchSchema.parse({ query: value });
      setSearchValue(value);
    } catch (error) {
      // Invalid input, don't update
      console.error('Invalid search input');
    }
  };

  const handleSelect = (mp: MP) => {
    onMPSelect(mp);
    setOpen(false);
  };

  const handleClear = () => {
    onMPSelect(null);
    setSearchValue('');
  };

  const filteredMPs = mps.filter((mp) =>
    mp.name.toLowerCase().includes(searchValue.toLowerCase()) ||
    mp.party.toLowerCase().includes(searchValue.toLowerCase()) ||
    mp.constituency.toLowerCase().includes(searchValue.toLowerCase())
  );

  return (
    <Card className="p-4">
      <div className="flex items-center gap-2">
        <div className="flex-1">
          <label className="text-sm font-medium mb-2 block">ค้นหา Voter</label>
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={open}
                className="w-full justify-between"
              >
                {selectedMP ? (
                  <span className="truncate">
                    {selectedMP.name} - {selectedMP.party}
                  </span>
                ) : (
                  <span className="text-muted-foreground">พิมพ์ชื่อ voter...</span>
                )}
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[400px] p-0 z-50" align="start">
              <Command>
                <CommandInput 
                  placeholder="ค้นหาด้วยชื่อ, พรรค หรือเขต..." 
                  value={searchValue}
                  onValueChange={handleSearch}
                />
                <CommandList>
                  <CommandEmpty>ไม่พบข้อมูล voter</CommandEmpty>
                  <CommandGroup>
                    {filteredMPs.slice(0, 50).map((mp) => (
                      <CommandItem
                        key={mp.id}
                        value={mp.id}
                        onSelect={() => handleSelect(mp)}
                        className="cursor-pointer"
                      >
                        <Check
                          className={cn(
                            'mr-2 h-4 w-4',
                            selectedMP?.id === mp.id ? 'opacity-100' : 'opacity-0'
                          )}
                        />
                        <div className="flex flex-col">
                          <span className="font-medium">{mp.name}</span>
                          <span className="text-xs text-muted-foreground">
                            {mp.party} • {mp.constituency}
                          </span>
                        </div>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        </div>
        {selectedMP && (
          <Button
            variant="ghost"
            size="icon"
            onClick={handleClear}
            className="mt-7 shrink-0"
            title="ล้างการเลือก"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
    </Card>
  );
};

export default VoterSearch;

const calculateSemicirclePosition = (index: number, total: number) => {
  const rows = 12; // จำนวนแถวทั้งหมด

  // คำนวณจำนวนที่นั่งในแต่ละแถว
  const seatsPerRowArray: number[] = [];
  let totalSeatsAllocated = 0;

  for (let i = 0; i < rows; i++) {
    const seatsInThisRow = 25 + i * 3;
    seatsPerRowArray.push(seatsInThisRow);
    totalSeatsAllocated += seatsInThisRow;
  }

  const diff = total - totalSeatsAllocated;
  seatsPerRowArray[rows - 1] += diff;

  // สร้าง array ของตำแหน่งทั้งหมด เรียงตามมุม (ซ้ายไปขวา) แล้วค่อยเรียงตามแถว (ในไปนอก)
  const positions: Array<{ angle: number; row: number; indexInRow: number }> = [];

  for (let row = 0; row < rows; row++) {
    const totalInRow = seatsPerRowArray[row];
    const startAngle = Math.PI;
    const endAngle = 0;
    const angleStep = (startAngle - endAngle) / (totalInRow > 1 ? totalInRow - 1 : 1);

    for (let seatInRow = 0; seatInRow < totalInRow; seatInRow++) {
      const angle = startAngle - angleStep * seatInRow;
      positions.push({ angle, row, indexInRow: seatInRow });
    }
  }

  // เรียงตามมุม (ซ้ายไปขวา) จากนั้นเรียงตามแถว (ในไปนอก)
  positions.sort((a, b) => {
    const angleDiff = b.angle - a.angle; // มุมมากไปน้อย (ซ้ายไปขวา)
    if (Math.abs(angleDiff) > 0.01) return angleDiff;
    return a.row - b.row; // แถวน้อยไปมาก (ในไปนอก)
  });

  const pos = positions[index];

  // คำนวณรัศมี
  const baseRadius = 20;
  const radiusIncrement = 2.3;
  const radius = baseRadius + pos.row * radiusIncrement;

  // คำนวณตำแหน่ง x, y
  const centerX = 50;
  const centerY = 50;

  const x = centerX + Math.cos(pos.angle) * radius;
  const y = centerY - Math.sin(pos.angle) * radius;

  return { x: `${x}%`, y: `${y}%`, row: pos.row };
};

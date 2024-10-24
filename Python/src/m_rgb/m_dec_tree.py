class M_DecTree:
    def __init__(self):
        self.image = None
        self.diffs = {}
        self.sorted_diffs = {}
        self.pixels = {}
        self.rgbs = []
        self.objects_pixels = {}
        self.objects = {}
        self.checked_pixels = {}

    def calc_rgb_diffs(self, image):
        self.image = image
        # Calculate the differences between adjacent pixels
        # loop through the rows of the dataframe and calculate the differences between adjacent pixels
        diffs = {}
        rgbs = image.load()
        print("Calculating differences...")
        self.rgbs = rgbs    

        for y in range(image.height):
            for x in range(image.width):
                r, g, b = rgbs[x, y]
                r1, g1, b1 = r, g, b
                r2, g2, b2 = r, g, b
                r3, g3, b3 = r, g, b
                r4, g4, b4 = r, g, b
                r5, g5, b5 = r, g, b
                r6, g6, b6 = r, g, b
                r7, g7, b7 = r, g, b
                r8, g8, b8 = r, g, b
                r9, g9, b9 = r, g, b
                r10, g10, b10 = r, g, b
                r11, g11, b11 = r, g, b
                r12, g12, b12 = r, g, b
                r13, g13, b13 = r, g, b
                r14, g14, b14 = r, g, b
                r15, g15, b15 = r, g, b
                r16, g16, b16 = r, g, b
                if y % 100 == 0 and x == 0:
                    print(f"Processing row {y}...")
                # Calculate the differences around 20 pixels
                for i in range(1, 17):
                    try:
                        if i == 1:
                            r1, g1, b1 = rgbs[x-1, y - 1]
                            diffs[(r - r1, g - g1, b - b1)] = 0
                        if i == 2:
                            r2, g2, b2 = rgbs[x-1, y]
                            diffs[(r - r2, g - g2, b - b2)] = 0
                        if i == 3:
                            r3, g3, b3 = rgbs[x-1, y + 1]
                            diffs[(r - r3, g - g3, b - b3)] = 0
                        if i == 4:
                            r4, g4, b4 = rgbs[x, y - 1]
                            diffs[(r - r4, g - g4, b - b4)] = 0
                        if i == 5:
                            r5, g5, b5 = rgbs[x, y + 1]
                            diffs[(r - r5, g - g5, b - b5)] = 0
                        if i == 6:
                            r6, g6, b6 = rgbs[x+1, y - 1]
                            diffs[(r - r6, g - g6, b - b6)] = 0
                        if i == 7:
                            r7, g7, b7 = rgbs[x+1, y]
                            diffs[(r - r7, g - g7, b - b7)] = 0
                        if i == 8:
                            r8, g8, b8 = rgbs[x+1, y + 1]
                            diffs[(r - r8, g - g8, b - b8)] = 0
                        if i == 9:
                            r9, g9, b9 = rgbs[x-2, y - 2]
                            diffs[(r - r9, g - g9, b - b9)] = 0
                        if i == 10:
                            r10, g10, b10 = rgbs[x-2, y]
                            diffs[(r - r10, g - g10, b - b10)] = 0
                        if i == 11:
                            r11, g11, b11 = rgbs[x-2, y + 2]
                            diffs[(r - r11, g - g11, b - b11)] = 0
                        if i == 12:
                            r12, g12, b12 = rgbs[x, y - 2]
                            diffs[(r - r12, g - g12, b - b12)] = 0
                        if i == 13:
                            r13, g13, b13 = rgbs[x, y + 2]
                            diffs[(r - r13, g - g13, b - b13)] = 0
                        if i == 14:
                            r14, g14, b14 = rgbs[x+2, y - 2]
                            diffs[(r - r14, g - g14, b - b14)] = 0
                        if i == 15:
                            r15, g15, b15 = rgbs[x+2, y]
                            diffs[(r - r15, g - g15, b - b15)] = 0
                        if i == 16:
                            r16, g16, b16 = rgbs[x+2, y + 2]
                            diffs[(r - r16, g - g16, b - b16)] = 0
                    except IndexError:
                        continue

                mDiff = (r - r1, g - g1, b - b1)
                for i in range(1, 17):
                    if i == 1:
                        mDiff = (r - r1, g - g1, b - b1)
                    if i == 2:
                        mDiff = (r - r2, g - g2, b - b2)
                    if i == 3:
                        mDiff = (r - r3, g - g3, b - b3)
                    if i == 4:
                        mDiff = (r - r4, g - g4, b - b4)
                    if i == 5:
                        mDiff = (r - r5, g - g5, b - b5)
                    if i == 6:
                        mDiff = (r - r6, g - g6, b - b6)
                    if i == 7:
                        mDiff = (r - r7, g - g7, b - b7)
                    if i == 8:
                        mDiff = (r - r8, g - g8, b - b8)
                    if i == 9:
                        mDiff = (r - r9, g - g9, b - b9)
                    if i == 10:
                        mDiff = (r - r10, g - g10, b - b10)
                    if i == 11:
                        mDiff = (r - r11, g - g11, b - b11)
                    if i == 12:
                        mDiff = (r - r12, g - g12, b - b12)
                    if i == 13:
                        mDiff = (r - r13, g - g13, b - b13)
                    if i == 14:
                        mDiff = (r - r14, g - g14, b - b14)
                    if i == 15:
                        mDiff = (r - r15, g - g15, b - b15)
                    if i == 16:
                        mDiff = (r - r16, g - g16, b - b16)

                    # add the difference to the dictionary
                    # if the difference is already in the dictionary, add x, y to the list of pixels

                    if mDiff in self.pixels:
                        self.pixels[mDiff].append((x, y))
                    else:
                        self.pixels[mDiff] = [(x, y)]

        self.diffs = diffs


    def max_rg_not_b(self, diff):
        # Return True if the maximum difference is in the red or green channel and not in the blue channel
        if abs(diff[2]) < 20:
            return max(diff[0], diff[1])
        else:
            return 20

    def print_out_max_diffs(self):
        # Print out the top 10 maximum differences for red and green channels and not blue
        print("Max differences:")
        # sorted_diffs = sorted(self.diffs.items(), key=lambda item: max(abs(item[0][0]), abs(item[0][1])), reverse=True)
        self.sorted_diffs = sorted(self.diffs.items(), key=lambda item: self.max_rg_not_b(item[0]), reverse=True)
        top_10_diffs = self.sorted_diffs[:10]
        for diff, _ in top_10_diffs:
            print(diff)

    def get_rg_not_b_pixels(self):
        # Return the pixels with differences > 100 for red and green channels and not blue
        rg_not_b_diffs = []
        rg_not_b_pixels = {}
        for diff, _ in self.sorted_diffs:
            if self.max_rg_not_b(diff) > 20:
                rg_not_b_diffs.append(diff)
            else:
                break

        for diff in rg_not_b_diffs:
            pixel = self.pixels[diff]
            for p in pixel:
                rg_not_b_pixels[p] = self.rgbs[p[0], p[1]]

        print(f"Number of pixels with red or green channel difference > 100 and blue channel difference < 100: {len(rg_not_b_pixels)}")  

        self.objects_pixels = rg_not_b_pixels      

        return rg_not_b_pixels
    
    def get_objects(self):
        # loop through the pixels and find the objects areas
        self.objects = {}
        self.checked_pixels = {}
        ik=0
        for p in self.objects_pixels:
            x, y = p
            if p in self.checked_pixels:
                continue
            self.checked_pixels[(x, y)] = True
            self.objects[ik] = [(x, y)]
            stack = [p]
            while stack:
                current_pixel = stack.pop()
                x, y = current_pixel
                for i in range(1, 5):
                    if i == 1:
                        x1, y1 = x-1, y
                    if i == 2:
                        x1, y1 = x+1, y
                    if i == 3:
                        x1, y1 = x, y-1
                    if i == 4:
                        x1, y1 = x, y+1
                    if (x1, y1) in self.checked_pixels:
                        continue
                    self.checked_pixels[(x1, y1)] = True
                    if (x1, y1) in self.objects_pixels:
                        self.objects[ik].append((x1, y1))
                        stack.append((x1, y1))
            ik += 1


    def order_objects_pixels(self):
        # order the objects pixels in rows by x, y
        for obj in self.objects:
            self.objects[obj].sort(key=lambda x: x[0]+x[1]*self.image.width)

    def add_pixels_inside_objects(self):
        # add the pixels inside the objects
        for obj in self.objects:
            # iterate through the pixels in the object
            # check if in the row x there are pixels between the pixels in the object
            # if there are, add them to the object

            for i in range(len(self.objects[obj])):
                x, y = self.objects[obj][i]
                if i == 0:
                    continue
                x1, y1 = self.objects[obj][i-1]
                #print(f"Checking pixels between {x1}, {y1} and {x}, {y}")
                if y1 == y:
                    for j in range(x1+1, x):
                        self.objects[obj].append((j, y))






    
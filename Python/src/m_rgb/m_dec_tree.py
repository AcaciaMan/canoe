class M_DecTree:
    def __init__(self):
        self.df = None
        self.df_diffs = None
        self.diffs = {}

    def calc_rgb_diffs(self, df):
        self.df = df
        # Calculate the differences between adjacent pixels
        # loop through the rows of the dataframe and calculate the differences between adjacent pixels
        diffs = {}
        rgbs ={}
        print("Calculating differences...")
        for index, row in df.iterrows():
            x, y = index
            r, g, b = row
            rgbs[(x, y)] = (r, g, b)


        for index, row in df.iterrows():
            x, y = index
            r, g, b = row
            # print x if x % 1000 == 0
            if y % 100 == 0 and x == 0:
                print(f"Processing row {y}...")
            # Calculate the differences around 20 pixels
            try:
                for i in range(1, 17):
                    if i == 1:
                        r1, g1, b1 = rgbs[(x-1, y - 1)]   # df.loc[x-1, y - 1]
                        diffs[(r - r1, g - g1, b - b1)] = 0
                    if i == 2:
                        r2, g2, b2 = rgbs[(x-1, y)]
                        diffs[(r - r2, g - g2, b - b2)] = 0
                    if i == 3:
                        r3, g3, b3 = rgbs[(x-1, y + 1)]
                        diffs[(r - r3, g - g3, b - b3)] = 0
                    if i == 4:
                        r4, g4, b4 = rgbs[(x, y - 1)]
                        diffs[(r - r4, g - g4, b - b4)] = 0
                    if i == 5:
                        r5, g5, b5 = rgbs[(x, y + 1)]
                        diffs[(r - r5, g - g5, b - b5)] = 0
                    if i == 6:
                        r6, g6, b6 = rgbs[(x+1, y - 1)]
                        diffs[(r - r6, g - g6, b - b6)] = 0
                    if i == 7:
                        r7, g7, b7 = rgbs[(x+1, y)]
                        diffs[(r - r7, g - g7, b - b7)] = 0
                    if i == 8:
                        r8, g8, b8 = rgbs[(x+1, y + 1)]
                        diffs[(r - r8, g - g8, b - b8)] = 0
                    if i == 9:
                        r9, g9, b9 = rgbs[(x-2, y - 2)]
                        diffs[(r - r9, g - g9, b - b9)] = 0
                    if i == 10:
                        r10, g10, b10 = rgbs[(x-2, y)]
                        diffs[(r - r10, g - g10, b - b10)] = 0
                    if i == 11:
                        r11, g11, b11 = rgbs[(x-2, y + 2)]
                        diffs[(r - r11, g - g11, b - b11)] = 0
                    if i == 12:
                        r12, g12, b12 = rgbs[(x, y - 2)]
                        diffs[(r - r12, g - g12, b - b12)] = 0
                    if i == 13:
                        r13, g13, b13 = rgbs[(x, y + 2)]
                        diffs[(r - r13, g - g13, b - b13)] = 0
                    if i == 14:
                        r14, g14, b14 = rgbs[(x+2, y - 2)]
                        diffs[(r - r14, g - g14, b - b14)] = 0
                    if i == 15:
                        r15, g15, b15 = rgbs[(x+2, y)]
                        diffs[(r - r15, g - g15, b - b15)] = 0
                    if i == 16:
                        r16, g16, b16 = rgbs[(x+2, y + 2)]
                        diffs[(r - r16, g - g16, b - b16)] = 0
            except KeyError:
                continue
        self.diffs = diffs

    def max_red_green_not_blue(self, diff):
        # Return True if the maximum difference is in the red or green channel and not in the blue channel
        if abs(diff[0][2]) < 100:
            return max(abs(diff[0][0]), abs(diff[0][1]))
        else:
            return 100

    def print_out_max_diffs(self):
        # Print out the top 10 maximum differences for red and green channels and not blue
        print("Max differences:")
        # sorted_diffs = sorted(self.diffs.items(), key=lambda item: max(abs(item[0][0]), abs(item[0][1])), reverse=True)
        sorted_diffs = sorted(self.diffs.items(), key=lambda item: self.max_red_green_not_blue(item), reverse=True)
        top_10_diffs = sorted_diffs[:10]
        for diff, _ in top_10_diffs:
            print(diff)


    
describe("Run tests", function() {
    describe("is_move tests", function() {
        it("should return false", function () {
            var move2 = {"old_pos": {"row": 4, "col": 4}, "new_pos": {"row": 2, "col": 2}};
            expect(is_move(move2)).toBe(false);
        });
        it("should return true", function () {
            var move2 = {"old_pos": {"row": 5, "col": 5}, "new_pos": {"row": 4, "col": 4}};
            expect(is_move(move2)).toBe(true);
        });

        it("should return true", function () {
            var move2 = {"old_pos": {"row": 5, "col": 5}, "new_pos": {"row": 4, "col": 6}};
            expect(is_move(move2)).toBe(true);
        });

        it("should return true", function () {
            var move2 = {"old_pos": {"row": 5, "col": 5}, "new_pos": {"row": 2, "col": 7}};
            expect(is_move(move2)).toBe(false);
        });
        

    });


});
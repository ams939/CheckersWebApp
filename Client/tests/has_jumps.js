var has_jump_board = [
    [
        null,
        null,
        null,
        null,
        {
            "piece_type": "KING",
            "owner": 1,
            "coordinates": {
                "row": 0,
                "col": 4
            }
        },
        null,
        null,
        null
    ],
    [
        null,
        null,
        null,
        {
            "piece_type": "KING",
            "owner": 2,
            "coordinates": {
                "row": 1,
                "col": 3
            }
        },
        null,
        {
            "piece_type": "KING",
            "owner": 2,
            "coordinates": {
                "row": 1,
                "col": 5
            }
        },
        null,
        null
    ],
    [
        null,
        {
            "piece_type": "KING",
            "owner": 1,
            "coordinates": {
                "row": 2,
                "col": 1
            }
        },
        null,
        null,
        null,
        null,
        {
            "piece_type": "KING",
            "owner": 2,
            "coordinates": {
                "row": 2,
                "col": 6
            }
        },
        null
    ],
    [
        null,
        null,
        {
            "piece_type": "KING",
            "owner": 2,
            "coordinates": {
                "row": 3,
                "col": 2
            }
        },
        null,
        null,
        {
            "piece_type": "KING",
            "owner": 1,
            "coordinates": {
                "row": 3,
                "col": 5
            }
        },
        null,
        null
    ],
    [
        null,
        {
            "piece_type": "KING",
            "owner": 1,
            "coordinates": {
                "row": 4,
                "col": 1
            }
        },
        null,
        {
            "piece_type": "KING",
            "owner": 1,
            "coordinates": {
                "row": 4,
                "col": 3
            }
        },
        {
            "piece_type": "KING",
            "owner": 2,
            "coordinates": {
                "row": 4,
                "col": 4
            }
        },
        null,
        {
            "piece_type": "KING",
            "owner": 2,
            "coordinates": {
                "row": 4,
                "col": 6
            }
        },
        null
    ],
    [
        null,
        null,
        {
            "piece_type": "KING",
            "owner": 1,
            "coordinates": {
                "row": 5,
                "col": 2
            }
        },
        null,
        null,
        null,
        null,
        null
    ],
    [
        null,
        null,
        null,
        {
            "piece_type": "KING",
            "owner": 1,
            "coordinates": {
                "row": 6,
                "col": 3
            }
        },
        null,
        null,
        null,
        null
    ],
    [
        null,
        null,
        null,
        null,
        {
            "piece_type": "KING",
            "owner": 2,
            "coordinates": {
                "row": 7,
                "col": 4
            }
        },
        null,
        null,
        null
    ]
];

describe("Run tests", function() {
    describe("has jumps function tests", function () {
        describe("Checks for valid jumps", function () {
            it("should return list of 3 valid jumps", function () {
                var coords = {"row": 3, "col": 2};
                expect(has_jumps(coords, has_jump_board).sort()).toEqual([{"row": 5, "col": 0},{"row": 5, "col": 4}, {"row": 1, "col": 0}].sort());
            });

            it("should return empty list", function () {
                var coords = {"row": 4, "col": 4};
                expect(has_jumps(coords, has_jump_board)).toEqual([]);
            });

            it("should return 1 move", function () {
                var coords = {"row": 4, "col": 1};
                expect(has_jumps(coords, has_jump_board)).toEqual([{"row": 2, "col": 3}]);
            });




        });
    });
});
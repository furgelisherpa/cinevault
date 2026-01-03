const mockMovies = [
    {
        id: 550,
        title: "Fight Club",
        poster_path: "/pB8BM7pdSp6B6Ih7QZ4DrQ3PmJK.jpg",
        backdrop_path: "/hZkgoQYus5vegHoetLkCJzb17zJ.jpg",
        overview: "A ticking-time-bomb insomniac and a slippery soap salesman channel primal male aggression into a shocking new form of therapy.",
        release_date: "1999-10-15",
        vote_average: 8.4,
        vote_count: 24755,
        popularity: 65.5,
        genre_ids: [18],
        genres: [{ id: 18, name: "Drama" }],
         credits: {
            cast: [
                { id: 287, name: "Brad Pitt", character: "Tyler Durden", profile_path: "/cckcYc2v0yh1tc9QjRelptcOBko.jpg" },
                { id: 819, name: "Edward Norton", character: "The Narrator", profile_path: "/eIkFHNlfretLS1spAcIoihKUS62.jpg" }
            ],
            crew: []
        },
        videos: {
            results: [{ key: "BdJKm16Co6M", site: "YouTube", type: "Trailer" }]
        }
    },
     {
        id: 27205,
        title: "Inception",
        poster_path: "/9gk7adHYeDvHkCSEqAvQNLV5Uge.jpg",
        backdrop_path: "/s3TBrRGB1jav7fwSaGj7ZR8patF.jpg",
        overview: "Cobb, a skilled thief who commits corporate espionage by infiltrating the subconscious of his targets is offered a chance to regain his old life.",
        release_date: "2010-07-15",
        vote_average: 8.4,
        vote_count: 32243,
        popularity: 80.5, 
        genre_ids: [28, 878, 12],
        genres: [{ id: 28, name: "Action" }, { id: 878, name: "Sci-Fi" }],
        credits: {
            cast: [
                 { id: 6193, name: "Leonardo DiCaprio", character: "Dom Cobb", profile_path: "/wo2hJpn04vbtmh0B9utCFdsQhxM.jpg" }
            ]
        },
        videos: {
             results: [{ key: "YoHD9XEInc0", site: "YouTube", type: "Trailer" }]
        }
    },
    {
        id: 157336,
        title: "Interstellar",
        poster_path: "/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg",
        backdrop_path: "/xJHokMBLlb5K4Mw09bQSNK1NZs.jpg",
        overview: "The adventures of a group of explorers who make use of a newly discovered wormhole to surpass the limitations on human space travel.",
        release_date: "2014-11-05",
        vote_average: 8.4,
        vote_count: 30000,
        popularity: 120.5,
        genre_ids: [12, 18, 878],
         genres: [{ id: 28, name: "Action" }, { id: 878, name: "Sci-Fi" }],
         credits: {
             cast: []
         },
         videos: { results: [] }
    }
];

module.exports = { results: mockMovies };

export const Documents = import.meta.glob('%/**/*.*', { as: 'raw' });
export const Gallery = import.meta.glob('%/**/*.{png,jpg,jpeg,PNG,JPEG}', { eager: true, as: 'url' });
// export const Definitions = import.meta.glob('~/**/*.*', { as: 'raw '});


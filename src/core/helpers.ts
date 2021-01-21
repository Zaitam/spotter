import { Application, SpotterOptionBase, SpotterShell } from './interfaces';

export const spotterSearch = (
  query: string,
  options: SpotterOptionBase[],
  prefix?: string,
): SpotterOptionBase[] => {
  if (!query || !options?.length) {
    return [];
  };

  if (!prefix) {
    return search(query, options);
  };

  const [ prefixFromQuery, ...restQuery ] = query.split(' ');
  const queryWithoutPrefix = restQuery.join(' ');

  if (prefix.toLowerCase().includes(prefixFromQuery.toLowerCase())) {
    return search(queryWithoutPrefix, options);
  };

  return [];
};

const search = (query: string, options: SpotterOptionBase[]): SpotterOptionBase[] => {
  if (!query && options?.length) {
    return options;
  };

  if (!options?.length) {
    return [];
  };

  return options
    .filter((item: SpotterOptionBase) => item.title?.toLowerCase().includes(query?.toLowerCase()))
    .sort((a, b) => a.title?.indexOf(query) - b.title?.indexOf(query));
}

export const getAllApplications = async (shell: SpotterShell): Promise<Application[]> => {
  const paths = [
    '/System/Applications',
    '/System/Applications/Utilities',
    '/Applications',
  ];

  const applicationsStrings: Application[][] = await Promise.all(
    paths.map(async path =>
      await shell
        .execute(`cd ${path} && ls`)
        .then(res => res.split('\n')
          .filter(title => title.endsWith('.app') && title !== 'spotter.app')
          .map(title => ({ title: title.replace('.app', ''), path: `${path}/${title}` }))
        )
    ),
  );

  const applications = applicationsStrings.reduce((acc, apps) => ([...acc, ...apps]), []);

  return applications;
}

export const isEmojiString = (str: string): boolean => {
  return false
  const emoji_regex = /(?:[\u2700-\u27bf]|(?:\ud83c[\udde6-\uddff]){2}|[\ud800-\udbff][\udc00-\udfff]|[\u0023-\u0039]\ufe0f?\u20e3|\u3299|\u3297|\u303d|\u3030|\u24c2|\ud83c[\udd70-\udd71]|\ud83c[\udd7e-\udd7f]|\ud83c\udd8e|\ud83c[\udd91-\udd9a]|\ud83c[\udde6-\uddff]|[\ud83c[\ude01-\ude02]|\ud83c\ude1a|\ud83c\ude2f|[\ud83c[\ude32-\ude3a]|[\ud83c[\ude50-\ude51]|\u203c|\u2049|[\u25aa-\u25ab]|\u25b6|\u25c0|[\u25fb-\u25fe]|\u00a9|\u00ae|\u2122|\u2139|\ud83c\udc04|[\u2600-\u26FF]|\u2b05|\u2b06|\u2b07|\u2b1b|\u2b1c|\u2b50|\u2b55|\u231a|\u231b|\u2328|\u23cf|[\u23e9-\u23f3]|[\u23f8-\u23fa]|\ud83c\udccf|\u2934|\u2935|[\u2190-\u21ff])/;
  return emoji_regex.test(str);
}

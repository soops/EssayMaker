﻿using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.IO;
using System.Linq;
using System.Windows;
using System.Windows.Input;
using System.Windows.Media;
using System.Windows.Shapes;
using EssayMaker.Core;
using MahApps.Metro;
using Microsoft.Win32;
using System.Windows.Documents;

namespace EssayMaker.Windows
{
    public class MainViewModel : PropertyChangedBase
    {
        private Essay _model;
        private string _title;
        private string _fontFamily;
        private int _fontSize;
        private bool _acceptsTab;

        public MainViewModel()
        {
            AddTopic = new SimpleCommand(OnAddTopic);
            NewEssay = new SimpleCommand(OnNewEssay);
            Open = new SimpleCommand(OnOpen);
            Save = new SimpleCommand(OnSave);
            SaveAs = new SimpleCommand(OnSaveAs);
            Export = new SimpleCommand(OnExport);

            FontSize = 14;
            FontFamily = "Segoe UI";

            OnNewEssay();
        }

        public string Title
        {
            get { return _title; }
            set
            {
                _title = value;
                NotifyPropertyChange();
            }
        }

        public string FilePath { get; set; }

        public List<string> FontFamilies
        {
            get { return Fonts.SystemFontFamilies.Select(x => x.ToString()).OrderBy(x => x).ToList(); }
        }

        public string FontFamily
        {
            get { return _fontFamily; }
            set
            {
                _fontFamily = value;
                NotifyPropertyChange();
            }
        }

        public List<int> FontSizes
        {
            get { return Enumerable.Range(5, 67).ToList(); }
        }

        public int FontSize
        {
            get { return _fontSize; }
            set
            {
                _fontSize = value;
                NotifyPropertyChange();
            }
        }

        public bool AcceptsTab
        {
            get { return _acceptsTab; }
            set
            {
                _acceptsTab = value;
                NotifyPropertyChange();
            }
        }

        public Essay Model
        {
            get { return _model; }
            set
            {
                if (_model != null)
                {
                    _model.PropertyChanged -= OnEssayPropertyChanged;
                }

                _model = value;
                NotifyPropertyChange();

                if (_model != null)
                {
                    _model.PropertyChanged += OnEssayPropertyChanged;
                }
                Title = "Essay Maker - " + (Model != null && !string.IsNullOrEmpty(Model.Title) ? Model.Title : "Untitled");    
            }
        }

        public ICommand AddTopic { get; private set; }

        public ICommand NewEssay { get; private set; }

        public ICommand Open { get; private set; }

        public ICommand Save { get; private set; }

        public ICommand SaveAs { get; private set; }

        public ICommand Export { get; private set; }

        private void OnEssayPropertyChanged(object sender, PropertyChangedEventArgs e)
        {
            if (e.PropertyName == "Title")
            {
                Title = "Essay Maker - " + (Model != null && !string.IsNullOrEmpty(Model.Title) ? Model.Title : "Untitled");    
            }
        }

        private void OnNewEssay()
        {
            Model = Essay.CreateNew();
            FilePath = null;
        }

        private void OnOpen()
        {
            var dialog = new OpenFileDialog()
            {
                Filter = "Essay Maker Files (*.em)|*.em",
            };

            if (dialog.ShowDialog() ?? false)
            {
                FilePath = dialog.FileName;
                Model = Essay.Deserialize(File.ReadAllText(FilePath));
            }
        }

        private void OnSave()
        {
            if (FilePath == null)
            {
                OnSaveAs();
                return;
            }

            File.WriteAllText(FilePath, Model.Serialize());
        }

        private void OnSaveAs()
        {
            var dialog = new SaveFileDialog()
            {
                Filter = "Essay Maker Files (*.em)|*.em",
                DefaultExt = ".em",
                FileName = Model.Title + ".em"
            };

            if (dialog.ShowDialog() ?? false)
            {
                FilePath = dialog.FileName;
                OnSave();
            }
        }

        private void OnAddTopic()
        {
            Model.Topics.Add(new EssayTopic()
            {
                Title = "Topic" + (Model.Topics.Count + 1).ToString()
            });
        }

        private void OnExport()
        {
            var dialog = new SaveFileDialog()
            {
                Filter = "Rich Text Files (*.rtf)|*.rtf",
                DefaultExt = ".rtf",
                FileName = Model.Title + ".rtf"
            };

            if (dialog.ShowDialog() ?? false)
            {
                var doc = new FlowDocument();

                doc.Blocks.Add(new Paragraph
                {
                    Inlines =
                    {
                        new Run(Model.Title),
                        new LineBreak(),
                        new Run(Model.Author),
                        new LineBreak(),
                        new Run(Model.TeacherName),
                        new LineBreak(),
                        new Run(Model.Date.ToShortDateString()),
                    },
                    TextAlignment = TextAlignment.Center
                });

                doc.Blocks.Add(new Paragraph(new Run(Model.Thesis)));

                doc.Blocks.AddRange(Model.Topics
                                         .Select(x => new Paragraph
                                         {
                                             Inlines =
                                             {
                                                 new Run(x.Title),
                                                 new LineBreak(),
                                                 new Run(x.Sentence),
                                                 new LineBreak(),
                                                 new Run(x.Examples),
                                                 new LineBreak(),
                                                 new Run(x.ConcludingSentence),
                                             }
                                         }));

                doc.Blocks.Add(new Paragraph(new Run(Model.Conclusion)));

                using (var fs = new FileStream(dialog.FileName, FileMode.OpenOrCreate, FileAccess.ReadWrite))
                {
                    var textRange = new TextRange(
                        doc.ContentStart,
                        doc.ContentEnd);

                    textRange.Save(fs, DataFormats.Rtf);
                }
            }
        }
    }
}